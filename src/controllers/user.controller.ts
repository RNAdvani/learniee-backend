import { COOKIE_OPTIONS } from "../config/cookies";
import { ErrorHandler } from "../lib/ErrorHandler";
import { TryCatch } from "../lib/TryCatch";
import { User } from "../models/user.model";
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const registerUser = TryCatch(async (req, res,next) =>{
    const { username, email, password , name} = req.body;

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        return next(new ErrorHandler(400, "User already exists"));
    }

    const user = await User.create({ username, email, password , name});

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!,{
        expiresIn: "7d"
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({ success: true, user });
})

export const loginUser = TryCatch(async (req, res,next) =>{
    const { email, password } = req.body;

    const user = await User.findOne({ email });


    if (!user) {
        return next(new ErrorHandler(400, "Invalid credentials"));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler(400, "Invalid credentials"));
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!,{
        expiresIn: "7d"
    });

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(200).json({ success: true, user });
})

export const logoutUser = TryCatch(async (req, res,next) =>{
    const { token } = req.cookies;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await User.findById(decoded?.userId);

    if (!user) {
        return next(new ErrorHandler(400, "User not found"));
    }

    user.isOnline = false;
    await user.save();

    res.clearCookie("token");

    res.status(200).json({ success: true, message: "Logged out" });
})

export const searchUser = TryCatch(async (req, res,next) =>{
    const { username } = req.query;
    console.log(username)
    const user = await User.find({ username : {$regex: username, $options: "i"} }).select("-password");
  
    const updatedUser = user.filter((u) => u._id.toString() !== req.user?.userId.toString());

    res.status(200).json({ success: true, user:updatedUser });
})


export const getUserById = TryCatch(async (req, res,next) =>{
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }

    res.status(200).json({ success: true, user });
})


export const getMe = TryCatch(async (req, res,next) =>{

    const user = await User.findById(req.user?.userId);

    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }

    res.status(200).json({ success: true, user });
})