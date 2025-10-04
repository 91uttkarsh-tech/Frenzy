import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { Box, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DarkMode, LightMode, ArrowBack } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const token = useSelector((state) => state.token);
  const isNonMobile = useMediaQuery("(min-width:1000px)");

  const getUser = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  }, [userId, token]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (!user) return <Box>Loading...</Box>;

  return (
    <Box>
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
         <FlexBetween gap="1rem">
          <IconButton onClick={() => {navigate(-1)}}><ArrowBack /></IconButton>
          <Typography
            fontWeight="bolder"
            fontSize="32px"
            color={theme.palette.secondary.dark}
          >
            Profile Info
          </Typography>
        </FlexBetween>

        <IconButton onClick={() => dispatch(setMode())}>
          {mode === "dark" ? (
            <DarkMode sx={{ fontSize: 25 }} />
          ) : (
            <LightMode sx={{ fontSize: 25, color: "black" }} />
          )}
        </IconButton>
      </Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobile ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        {/* LEFT COLUMN */}
        <Box flexBasis={isNonMobile ? "26%" : "100%"}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} isProfile={true}/>
        </Box>

        {/* RIGHT COLUMN */}
        <Box flexBasis={isNonMobile ? "42%" : "100%"}>
          <PostsWidget userId={userId} isProfile={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
