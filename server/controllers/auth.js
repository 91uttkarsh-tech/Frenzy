import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath, friends = [], location = "", occupation = "" } = req.body;

    if (await User.findOne({ email }))
      return res.json({ status: false, message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    await new User({ firstName, lastName, email, password: passwordHash, picturePath, friends, location, occupation, viewedProfile: Math.floor(Math.random() * 10000), impressions: Math.floor(Math.random() * 10000) }).save();

    res.status(201).json({ status: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error. Please try again later." });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.json({ status: false, msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({status: false, msg: "Invalid credentials. " });
    
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET );

    delete user.password;
    res.status(200).json({ token, user, status: true });
    
  } catch (err) {
    res.status(500).json({status: false, error: err.message });
  }
};


//Delete user:-
export const deleteAccount = async (req, res) => {
  try {
    const {name} = req.body;
    const user = await User.deleteOne({firstName:name});
    console.log(user.deletedCount);
    if(user.deletedCount===1){
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Searching user :-
export const Search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
      ],
    }).limit(10); 

    res.status(200).json({users,status:true});
  } catch (err) {
    res.status(500).json({ status:false,error: err.message });
  }
};




