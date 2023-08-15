import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import Share from "components/share";
import { useState, useEffect ,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const myRef = useRef();
  const isNonMobile = useMediaQuery("(min-width:1000px)");
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const [x, setComment] = useState("");
  const [NumberOfComments, setNumberOfComments] = useState(0);
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserName = useSelector((state) => state.user.firstName);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.secondary.dark;

  useEffect(() => {
    var result = 0;
    for(let i = 0 ; i < (comments.length); i++){
      result += ((comments[i].comments).length);
    }
    setNumberOfComments(result);
  });

  const patchLike = async () => {
    const response = await fetch(`http://localhost:6001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const patchComment = async () => {
    if (x.length > 0) {
      const response = await fetch(
        `http://localhost:6001/posts/${postId}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            comment: x,
            key: "add",
          }),
        }
      );
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setComment("");
    }
  };

  const removeComents = async () => {
    console.log(myRef.current);
    const response = await fetch(
      `http://localhost:6001/posts/${postId}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: "remove", userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:6001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{NumberOfComments}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <Share/>
        </IconButton>
      </FlexBetween>



      {isComments && (
        <Box sx={{ display: "flex", alignItems:'center',
          justifyContent:'center',flexDirection: "column"}}>
      <FlexBetween sx={{display:'flex',flexDirection:'column'}}>
        <Box pt="0.5rem" pb="0.5rem" className="scroll" sx={{
          maxHeight:'20rem',
          overflowY:'scroll',
        }}>
          {comments.map((val, i) => {
            return (
              <Box
                key={`${i}`}
                width={isNonMobile?"30vw":'70vw'}
                style={{
                  wordWrap: "break-word",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {(val.Id===loggedInUserId)?<h2>{loggedInUserName}</h2>:''}
                {val.comments.map((comment, index) => {
                  return (
                   <FlexBetween>
                    <Divider/>
                     <span key={index}
                      ref={myRef}
                     id={`div-${index}`}
                     style={{
                      padding:'0.2rem 0.4rem',
                      display:'flex',
                      flexDirection:'row',
                      alignItems:'center',
                      justifyContent:'space-between',
                      width: "100%",
                      fontSize:'large',
                      }}>
                     {comment}
                     {(val.Id===loggedInUserId)?
                     <DeleteIcon
                       onClick={removeComents}
                       sx={{ height: "1.5rem", width: "1.5rem" }}
                     />:''}
                    </span>
                    <Divider/>
                  </FlexBetween>
                  );
                })}
            <Divider />
              </Box>
            );
          })}
        </Box>
         <Box
         pt={"2rem"}
         display={"flex"}
         alignItems={"center"}
         justifyContent={"center"}
         gap={"1rem"}
         width={isNonMobile?"32vw":'70vw'}
       >
         <TextField
           fullWidth
           label="Add comment"
           sx={{ overflow: "hidden",
           }}
           value={x}
           onChange={(e) => {
             setComment(e.target.value);
           }}
         />
         <SendIcon
           onClick={patchComment}
           sx={{ height: "2rem", width: "2rem" }}
         />
       </Box>
       </FlexBetween>
      </Box> 
      
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
