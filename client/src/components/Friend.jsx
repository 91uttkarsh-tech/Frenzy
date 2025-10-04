import React, { useState } from 'react';
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, ListItemIcon } from "@mui/material";
import { useDispatch, useSelector, } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ArchiveIcon from "@mui/icons-material/Archive";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CommentOffIcon from "@mui/icons-material/ModeCommentOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


const Friend = ({ friendId, name, subtitle, userPicturePath,isProfile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { palette } = useTheme();
  const primaryLight = palette.secondary.main;
  const primaryDark = palette.secondary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <FlexBetween>

      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box >
          <Typography
            onClick={() => navigate(`/profile/${friendId}`)}
            color={main}
            variant="h5"
            fontWeight="500"
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>

      {_id !== friendId ? (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      ) : (!isProfile &&
        <>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleClick}>
            <MoreVertIcon sx={{ color: primaryDark, cursor: "pointer" }} />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                'aria-labelledby': 'basic-button',
              },
            }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon><BookmarkBorderIcon fontSize="small" /></ListItemIcon>
              Save
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <ListItemIcon><ArchiveIcon fontSize="small" /></ListItemIcon>
              Archive
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <ListItemIcon><VisibilityOffIcon fontSize="small" /></ListItemIcon>
              Hide like count
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <ListItemIcon><CommentOffIcon fontSize="small" /></ListItemIcon>
              Turn off commenting
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
              Edit
            </MenuItem>

            <MenuItem onClick={handleClose} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
        </>

      )}
    </FlexBetween>
  );
};

export default Friend;

