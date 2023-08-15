import * as React from "react";
import Box from "@mui/material/Box";
import ShieldIcon from "@mui/icons-material/Shield";
import SecurityIcon from "@mui/icons-material/Security";
import RemoveModeratorIcon from "@mui/icons-material/RemoveModerator";
import Notifications from "@mui/icons-material/Notifications";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import List from "@mui/material/List";
import { Divider, useTheme, useMediaQuery } from "@mui/material";
import { DarkMode, LightMode ,Help } from "@mui/icons-material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import { useSelector, useDispatch } from "react-redux";
import { setLogout, setPrivate, setMode } from "state";
import LogoutIcon from '@mui/icons-material/Logout';

export default function TemporaryDrawer(props) {
  const privacy = useSelector((state) => state.privacy);
  const mode = useSelector((state) => state.mode);
  const [state, setState] = React.useState({ right: false, bottom: false });
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const dark = theme.palette.secondary.dark;
  const Dispatch = useDispatch();

  const toggleDrawer = (anchor, open) => () => {
    setState({ ...state, [anchor]: open });
  };

  const remove = async () => {
    const response = await fetch(`http://localhost:6001/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: props.name }),
    });
    
  };

  const toggle = (e) => {
    e.preventDefault();
    Dispatch(setPrivate());
  };

  return (
    <React.Fragment>
      <Button
        sx={{ backgroundColor: dark, color: "white" }}
        onClick={toggleDrawer("right", true)}
      >
        {props.name}
      </Button>

      <Drawer
        anchor={"bottom"}
        open={state["bottom"]}
        onClose={toggleDrawer("bottom", false)}
      >
        <Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={toggle}>
                <ListItemIcon>
                  {privacy ? <RemoveModeratorIcon /> : <ShieldIcon />}
                </ListItemIcon>
                <ListItemText>
                  {privacy ? <p>Private account</p> : <p>Public account</p>}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Drawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        <Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={remove}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText>Delete Account</ListItemText>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={toggleDrawer("bottom", true)}>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText>Privacy</ListItemText>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText>Notifications</ListItemText>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </ListItemButton>
            </ListItem>

            {isNonMobileScreens ? (
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText>Mail</ListItemText>
                </ListItemButton>
              </ListItem>
            ) : (
             <>
               <ListItem disablePadding>
                  <ListItemButton onClick={() => Dispatch(setMode())}>
                    <ListItemIcon>
                      {mode === "light" ? <LightMode /> : <DarkMode />}
                    </ListItemIcon>
                    <ListItemText>
                      {mode === "light" ? <p>LightMode</p> : <p>DarkMode</p>}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton onClick={() => Dispatch(setMode())}>
                    <ListItemIcon>
                      <Help/>
                    </ListItemIcon>
                    <ListItemText>
                     Help
                    </ListItemText>
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton onClick={() => Dispatch(setMode())}>
                    <ListItemIcon>
                      <PlayCircleOutlineRoundedIcon/>
                    </ListItemIcon>
                    <ListItemText>
                     Reels
                    </ListItemText>
                  </ListItemButton>
                </ListItem>

                </>
            )}

            <Divider />

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  Dispatch(setLogout());
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText>LogOut</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
