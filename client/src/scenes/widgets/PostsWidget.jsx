import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import Skeleton from "@mui/material/Skeleton";
import WidgetWrapper from "components/WidgetWrapper";
import { Box, Typography } from "@mui/material";
import { ArticleOutlined } from "@mui/icons-material";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const [loading, setloading] = useState(true);
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
    setloading(false);
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
    setloading(false);
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []);

  if (loading) {
    return (
      <WidgetWrapper m="2rem 0" sx={{ py: 2 }}>
        <Box >
          <WidgetWrapper sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <WidgetWrapper>
              <Skeleton variant="text" width={200} height={30} />
              <Skeleton variant="text" width={250} height={20} />
            </WidgetWrapper>
          </WidgetWrapper>
          <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: 1 }} />
        </Box>
      </WidgetWrapper>
    );
  }

  return (
    <>
      {posts.length ? posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      ) :
        <WidgetWrapper m="2rem 0" sx={{ textAlign: "center", py: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <ArticleOutlined sx={{ fontSize: 48, color: "text.disabled" }} />
            <Typography variant="h6" color="text.secondary">
              No posts available
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Be the first one to create a post!
            </Typography>
          </Box>
        </WidgetWrapper>
      }
    </>
  );
};

export default PostsWidget;
