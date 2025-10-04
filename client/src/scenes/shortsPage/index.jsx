"use client";
import { Box, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DarkMode, LightMode ,ArrowBack} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "state";
import ShortFeed from "components/ShortsFeed";
import { useNavigate } from "react-router-dom";

const ShortsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const isNonMobileScreens = useMediaQuery("(min-width: 768px)");

  return (
    <Box sx={{ height: "100vh", overflowY: "hidden", backgroundColor: theme.palette.background.default }}>
      {/* Header */}
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 5%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        position="sticky"
        top={0}
        zIndex={1000}
      >
        <IconButton onClick={() => {navigate(-1)}}><ArrowBack /></IconButton>
        <Typography
          fontWeight="bolder"
          fontSize="32px"
          color={theme.palette.secondary.dark}
        >
          Frenzy Reels
        </Typography>

        <IconButton onClick={() => dispatch(setMode())}>
          {mode === "dark" ? (
            <DarkMode sx={{ fontSize: 25 }} />
          ) : (
            <LightMode sx={{ fontSize: 25, color: "black" }} />
          )}
        </IconButton>
      </Box>

      {/* Shorts Feed */}
      <ShortFeed isNonMobileScreens={isNonMobileScreens} />
    </Box>
  );
};

export default ShortsPage;
