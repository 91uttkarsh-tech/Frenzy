import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";


const PeoplesWidget = ({ userId }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [people, setPeople] = useState([]);
  const primaryLight = palette.secondary.main;
  const primaryDark = palette.secondary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const friends = useSelector((state) => state.user.friends);

  const getNearbyPeople = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/nearby/${userId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error("Error fetching nearby people:", error);
    }
  };

  const toggleFriend = async (friendId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/${userId}/${friendId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updated = await response.json();
      setPeople((prev) =>
        prev.map((p) =>
          p._id === friendId ? { ...p, isFriend: !p.isFriend } : p
        )
      );
      dispatch(setFriends({ friends: updated }));

    } catch (error) {
      console.error("Error updating friend:", error);
    }
  };

  useEffect(() => {
    getNearbyPeople();
  }, [friends]);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        People Near You
      </Typography>

      <Box display="flex" flexDirection="column" gap="1.5rem">
        {people.length > 0 ? (
          people.map((person) => (
            <Box
              key={person._id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
            
              <FlexBetween gap="1rem">
                <UserImage image={person.picturePath} size="55px" />
                <Box
                  onClick={() => {
                    navigate(`/profile/${person._id}`);
                    navigate(0);
                  }}
                >
                  <Typography
                    color={main}
                    variant="h5"
                    fontWeight="500"
                    sx={{
                      "&:hover": {
                        color: palette.primary.light,
                        cursor: "pointer",
                      },
                    }}
                  >
                    {`${person.firstName} ${person.lastName}`}
                  </Typography>
                  <Typography color={medium} fontSize="0.75rem">
                    {person.occupation || person.location}
                  </Typography>
                </Box>
              </FlexBetween>

              <IconButton
                onClick={() => toggleFriend(person._id)}
                sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
              >
                {person.isFriend ? (
                  <PersonRemoveOutlined sx={{ color: primaryDark }} />
                ) : (
                  <PersonAddOutlined sx={{ color: primaryDark }} />
                )}
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography color={palette.neutral.medium}>
            No nearby people found.
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default PeoplesWidget;
