import asyncHandler from "express-async-handler";
import {User} from "../models/user.js";
import * as generateToken from "../config/generateToken.js"

const registerUser = asyncHandler(async (req, res) => {
  // res.send("hello");
  const { name, username, email, password, picture } = req.body;
  console.log(req.body);

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Kindly fill up the required fields");
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
    picture,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create new user");
  }
});

const loginUser = asyncHandler(async(req,res)=>{
    try{
    const {username, password} = req.body;
    const userExists = await User.findOne({username});

    if(userExists && (await userExists.matchPassword(password))){
        res.status(200).json({
            user: userExists,
            message: "user successfully logged in",
            token: generateToken(userExists._id)
        });
    }else{
        res.status(400);
        throw new Error("Invalid username or password");
    }
}catch(err){
    res.status(500);
    throw new Error(err);
}

})

  export { registerUser, loginUser };
