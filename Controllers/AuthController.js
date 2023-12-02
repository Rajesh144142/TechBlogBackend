import UserModel from '../Models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
//import {asyncHandler} from '../Utils/asyncHandler.js'


export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'User Not Found' });
        }


        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ msg: 'Invalid password' });
        }
        user.password = undefined;
        const token = jwt.sign({ id: user._id, email: email }, process.env.JWT_SECRET, { expiresIn: '2h' });
        //user.password = undefined;
        return res.status(200).cookie("token", token).json({ username: user.username, email: user.email, _id: user._id });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        } else {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
}


export async function signup(req, res) {
    try {
        const { username, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(401).json({ msg: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({ username, email, password: hashedPassword });
        // newUser.password = undefined;

        const token = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Return statement after successful registration
        return res.status(200).cookie("token", token).json({
            username: newUser.username,
            email: newUser.email,
            _id: newUser._id
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        } else {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }

    }
}


// export async function ProfileEdit(req,res){
//     try {
//         const


//     } catch (error) {
//         res.status(404).json({ msg: 'Token is Expired' });
//     }
// }
export async function profile(req, res) {
    try {
        const { token } = req.cookies;
        const response = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = response;
        const profileInfo = await UserModel.findOne({ _id: id });
        // profileInfo.password = undefined
        res.status(200).json({ _id: profileInfo._id, username: profileInfo.username, email: profileInfo.email });
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token'});
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        } else {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
}


export async function logout(req, res) {
    res.cookie('token', '').json({ msg: 'ok' });
}