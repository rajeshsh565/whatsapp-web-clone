import User from "../models/UserModel.js"
import { hashPassword, verifyPassword } from "../utils/hashPasswords.js";
import jwt from "jsonwebtoken";

export const register = async(req, res) =>{
  try {
    const { name, phone, password } = req.body;
    if(!name || !phone || !password) {
      return res.status(400).json({ msg: 'All required info not provided!' });
    }
    const user = await User.findOne({ phone});
    if(user){
      return res.status(400).json({ msg: 'User already exists!' });
    }
    const hashedPassword = await hashPassword(password);
    // check if user exists
    await User.create({
      name, phone, password
    });
    res.status(201).json({ msg: 'User registration successful!' });
  } catch (error) {
    console.log("register error: ", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}

export const login = async(req, res) => {
  try {    
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    const isValidLogin = user && verifyPassword(password, user?.password);
    if(!isValidLogin){
      return res.status(400).json({ msg: 'Incorrect phone or password!' });
    }
    const oneDaySeconds = 24*60*60;
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '3d' });
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDaySeconds*3*1000),
      secure: process.env.NODE_ENV === 'prod'
    });
    return res.status(200).json({ msg: 'Login Success!' });
  } catch (error) {
    console.log("login error: ", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
}

export const logout = (req,res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  return res.status(200).json({ msg: 'Logout Success!' });
}