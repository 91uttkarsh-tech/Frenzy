import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  PlayCircleOutlineRounded,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";

import FlexBetween from "components/FlexBetween";
import Drawer from "components/drawer";
import SearchBox from "components/SearchBox";

// Reusable icon button
const NavIconButton = ({ onClick, children }) => (
  <IconButton onClick={onClick} sx={{ fontSize: "25px" }}>
    {children}
  </IconButton>
);

// User dropdown menu
const UserMenu = ({ fullName, onLogout }) => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  return (
    <FormControl variant="standard" value={fullName}>
      <Select
        value={fullName}
        sx={{
          backgroundColor: neutralLight,
          width: "180px",
          borderRadius: "0.25rem",
          p: "0.25rem 1rem",
          "& .MuiSvgIcon-root": { pr: "0.25rem", width: "3rem" },
          "& .MuiSelect-select:focus": { backgroundColor: neutralLight },
        }}
        input={<InputBase />}
      >
        <MenuItem value={fullName}>{fullName}</MenuItem>
        <MenuItem onClick={onLogout}>Log Out</MenuItem>
      </Select>
    </FormControl>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:1000px)");
  const isNonTab = useMediaQuery("(min-width:620px)");

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={theme.palette.background.alt}>
      {/* LEFT: Logo + Search */}
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem,2rem,2.25rem)"
          color={theme.palette.secondary.dark}
          onClick={() => navigate("/home")}
          sx={{ "&:hover": { color: theme.palette.secondary.main, cursor: "pointer" } }}
        >
          Frenzy
        </Typography>

        {isNonTab && <SearchBox />}
      </FlexBetween>

      {/* RIGHT: Desktop Nav */}
      {isNonMobile ? (
        <FlexBetween gap="2rem">
          <NavIconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode sx={{ color: theme.palette.neutral.dark }} />}
          </NavIconButton>

          <NavIconButton onClick={() => navigate("/shorts")}>
            <PlayCircleOutlineRounded sx={{ fontSize: "35px" }} />
          </NavIconButton>

          <NavIconButton><Message /></NavIconButton>
          <NavIconButton><Notifications /></NavIconButton>
          <NavIconButton><Help /></NavIconButton>

          <Drawer name={user.firstName} token={token} />
        </FlexBetween>
      ) : (
        <Drawer name={user.firstName} token={token} />
      )}

      {/* MOBILE NAV */}
      {!isNonMobile && isMobileMenuOpen && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          maxWidth="500px"
          minWidth="300px"
          zIndex="10"
          backgroundColor={theme.palette.background.default}
        >
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton onClick={() => setIsMobileMenuOpen(false)}><Close /></IconButton>
          </Box>

          <FlexBetween flexDirection="column" alignItems="center" gap="1rem">
            <UserMenu fullName={fullName} onLogout={() => dispatch(setLogout())} />

            <NavIconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode sx={{ color: theme.palette.neutral.dark }} />}
            </NavIconButton>

            <FlexBetween gap="1rem" justifyContent="flex-start" width="100%" px={2}>
              <Message /> <Typography>Message</Typography>
            </FlexBetween>
            <FlexBetween gap="1rem" justifyContent="flex-start" width="100%" px={2}>
              <Notifications /> <Typography>Notifications</Typography>
            </FlexBetween>
            <FlexBetween gap="1rem" justifyContent="flex-start" width="100%" px={2}>
              <Help /> <Typography>Help</Typography>
            </FlexBetween>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
