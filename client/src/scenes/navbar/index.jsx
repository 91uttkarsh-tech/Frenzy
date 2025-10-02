import { useState } from "react";
import {
  Box, IconButton, InputBase, Typography, Select,
  MenuItem, FormControl, useTheme, useMediaQuery,
} from "@mui/material";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import {
  Message, DarkMode, LightMode,
  Notifications, Help, Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import Drawer from "components/drawer";
import SearchBox from "components/SearchBox";
import axios from "axios";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Searching, setSearching] = useState([]);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isNonTabScreens = useMediaQuery("(min-width: 620px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.secondary.dark;
  const alt = theme.palette.background.alt;
  const fullName = `${user.firstName} ${user.lastName}`;

  const handleSearchChange = (event) => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/search`).then((response) => {
      console.log(response.data);
      // setSearching(response.data);
    });
  }

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color={primaryLight}
          onClick={() => navigate("/home")}
          onChange={handleSearchChange}
          sx={{
            "&:hover": {
              color: theme.palette.secondary.main,
              cursor: "pointer",
            },
          }}
        >
          Faciogram
        </Typography>
        {isNonTabScreens && (
          <FlexBetween sx={{ cursor: "pointer" }}>
            <SearchBox name={Searching} />
          </FlexBetween>
        )}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem" sx={{ cursor: "pointer" }}>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <PlayCircleOutlineRoundedIcon sx={{ fontSize: "35px" }} />
          <Message sx={{ fontSize: "25px" }} />
          <Notifications sx={{ fontSize: "25px" }} />
          <Help sx={{ fontSize: "25px" }} />
          <Drawer name={user.firstName} token={token} />
        </FlexBetween>
      ) : (<Drawer name={user.firstName} token={token} />)}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
              <Close />
            </IconButton>
          </Box>


          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="1rem"
          >
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "180px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
                freeSolo
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <>
                  <DarkMode sx={{ height: '2rem', width: "2rem" }} />
                  <p>LightMode</p>
                </>
              ) : (
                <>
                  <LightMode sx={{ color: dark, height: '2rem', width: "2rem" }} />
                  <p>DarkMode</p>
                </>
              )}
            </IconButton>
            <Box display='flex' alignItems='center' gap='1rem' justifyContent='flex-start'>
              <Message sx={{ fontSize: "25px" }} />
              <p>Message</p>
            </Box>
            <Box display='flex' alignItems='center' gap='1rem' justifyContent='flex-start'>
              <Notifications sx={{ fontSize: "25px" }} />
              <p>Notifications</p>
            </Box>
            <Box display='flex' alignItems='center' gap='1rem' justifyContent='flex-start'>
              <Help sx={{ fontSize: "25px" }} />
              <p>Help</p>
            </Box>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
