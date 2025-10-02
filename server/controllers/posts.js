import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find({isDeleted:false});
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const {userId,comment,key } = req.body;
    console.log(req.body);
    const post = await Post.findById(id);
    const array = [comment];
    const finalArr = {Id:userId,comments:array};
    if(key==="add"){
      if(post.comments.length==0){
        post.comments.push(finalArr);
      }
      else{
        let idPresent = (post.comments).filter((value)=>{
          return (value.Id===userId)
        });
        if(idPresent.length>0){
          let index = 0;
          while(index<=(post.comments).length){
            if(post.comments[index].Id===userId){break}
            index++;
          }
          post.comments[index].comments.push(comment);
        }
        else{
          post.comments.push(finalArr);
        }
      }
    }
    if(key==='remove'){
      let idPresent = (post.comments).filter((value)=>{
        return (value.Id===userId)
      });
      if(idPresent.length>0){
        let index = 0;
        while(index<(post.comments).length){
          if(post.comments[index].Id===userId){break}
        }
        post.comments.splice(index,1);
      }
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
