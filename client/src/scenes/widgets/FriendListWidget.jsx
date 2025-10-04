import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import { useState } from "react";

const FriendListWidget = ({ userId }) => {
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [friendsList, setFriendsList] = useState([]);
  const friends = useSelector((state) => state?.user?.friends) || [];

  const getFriends = async () => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((res) => res.json()).then((data) => {
      setFriendsList(data);
    })
      .catch((error) => {
        console.error("Error fetching friends:", error);
      });
  };

  useEffect(() => {
    getFriends();
  }, [friends]);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friendsList.length > 0 ? friendsList?.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        )) : 
        (<Typography color={palette.neutral.medium}>
          You have no friends added.
        </Typography>)}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
