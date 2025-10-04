"use client";
import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, IconButton, Slider, Tooltip } from "@mui/material";
import { PlayArrow, Pause, VolumeUp, VolumeOff, Fullscreen } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const PEXELS_API_KEY = "Kyd1qbrIg4mug92WcYlzKKpSNqr3vaBv1fKsytuU1BGXpYyB0ng2LwPd";
const PEXELS_API_URL = "https://api.pexels.com/videos/search?query=nature&orientation=portrait&per_page=10";

const ShortFeed = ({ isNonMobileScreens }) => {
    const [shortsData, setShortsData] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const videoRefs = useRef([]);
    const theme = useTheme();

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const response = await fetch(PEXELS_API_URL, { headers: { Authorization: PEXELS_API_KEY } });
                const data = await response.json();
                const formatted = data.videos.map((v) => ({
                    id: v.id,
                    title: v.user.name || "Pexels Video",
                    videoUrl: v.video_files.find((f) => f.height >= 1080)?.link || v.video_files[0].link,
                }));
                setShortsData(formatted);
            } catch (err) {
                console.error("Error fetching Pexels shorts:", err);
            }
        };

        fetchShorts();
    }, []);

    // Update progress
    useEffect(() => {
        videoRefs.current.forEach((video) => {
            if (video) {
                video.addEventListener("timeupdate", () => {
                    if (video.duration) {
                        setProgress((video.currentTime / video.duration) * 100);
                    }
                });
            }
        });
    }, [shortsData]);

    const handlePlayPause = (index) => {
        videoRefs.current.forEach((v, i) => {
            if (v && i !== index) v.pause();
        });

        const video = videoRefs.current[index];
        if (video) {
            if (video.paused) {
                video.play();
                setCurrentVideo(index);
            } else {
                video.pause();
                setCurrentVideo(null);
            }
        }
    };

    const handleMuteToggle = (index) => {
        const video = videoRefs.current[index];
        if (video) {
            video.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleFullscreen = (index) => {
        const video = videoRefs.current[index];
        if (video && video.requestFullscreen) {
            video.requestFullscreen();
        }
    };

    const handleProgressChange = (e, index) => {
        const video = videoRefs.current[index];
        if (video) {
            const newTime = (e.target.value / 100) * video.duration;
            video.currentTime = newTime;
            setProgress(e.target.value);
        }
    };

    if(shortsData.length === 0) {
        return (
            <Box sx={{ height: "calc(100vh - 70px)", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: theme.palette.background.alt }}>
                <Typography variant="h6" color={theme.palette.text.secondary}>Loading Shorts...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: "calc(100vh - 70px)", overflowY: "scroll", scrollSnapType: "y mandatory", backgroundColor: theme.palette.background.alt, py: 2 }}>
            {shortsData.map((short, index) => (
                <Box
                    key={short.id}
                    sx={{
                        width: isNonMobileScreens ? "420px" : "95%",
                        height: "85vh",
                        borderRadius: "20px",
                        overflow: "hidden",
                        scrollSnapAlign: "center",
                        margin: "20px auto",
                        position: "relative",
                        backgroundColor: "#000",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.7)",
                        },
                    }}
                >
                    <video
                        ref={(el) => (videoRefs.current[index] = el)}
                        src={short.videoUrl}
                        muted={isMuted}
                        loop
                        playsInline
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "20px",
                        }}
                        onClick={() => handlePlayPause(index)}
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: "70px",
                            left: "20px",
                            color: "white",
                            textShadow: "0px 2px 10px rgba(0,0,0,0.8)",
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold">
                            {short.title}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: "15px",
                            left: 0,
                            right: 0,
                            px: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "rgba(0,0,0,0.4)",
                            borderRadius: "0 0 20px 20px",
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <Tooltip title={currentVideo === index ? "Pause" : "Play"}>
                                <IconButton onClick={() => handlePlayPause(index)}>
                                    {currentVideo === index ? (
                                        <Pause sx={{ color: "#fff" }} />
                                    ) : (
                                        <PlayArrow sx={{ color: "#fff" }} />
                                    )}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                                <IconButton onClick={() => handleMuteToggle(index)}>
                                    {isMuted ? (
                                        <VolumeOff sx={{ color: "#fff" }} />
                                    ) : (
                                        <VolumeUp sx={{ color: "#fff" }} />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box sx={{ flexGrow: 1, mx: 1 }}>
                            <Slider
                                value={progress}
                                onChange={(e) => handleProgressChange(e, index)}
                                sx={{
                                    color: "#fff",
                                    "& .MuiSlider-thumb": { display: "none" },
                                }}
                            />
                        </Box>

                        <Tooltip title="Fullscreen">
                            <IconButton onClick={() => handleFullscreen(index)}>
                                <Fullscreen sx={{ color: "#fff" }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default ShortFeed;
