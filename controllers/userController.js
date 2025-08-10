import User from "../models/UserModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById({_id:req.user.id}, { name:1, phone:1 });
    return res.status(200).json({user});
  } catch (error) {
    console.log("getCurrentUser error: ", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { name:1, phone:1 });
    return res.status(200).json({users});
  } catch (error) {
    console.log("getCurrentUser error: ", error);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};