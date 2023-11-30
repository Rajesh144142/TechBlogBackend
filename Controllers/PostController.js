import {
    PostModel
} from "../Models/PostModel.js";
import uploadOnCloudinary from "../Utils/cloudinary.js";
import jwt from 'jsonwebtoken';
export async function createPost(req, res) {
    try {
        const { token } = req.cookies;
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const response = await uploadOnCloudinary(req.file.path);
        const { title, summary, content } = req.body;
        const postDet = await PostModel.create({
            title, summary, content,
            cover: response.url,
            author: user.id,
        })
        res.status(200).json(postDet);

    } catch (error) {

    }
}


export async function getAllPost(req, res) {
    try {
        const response = await PostModel.find()
            .populate('author', ['username', "email"])
            .sort({ createdAt: -1 });
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in getAllPost:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export async function getAPost(req, res) {
    try {
        const { id } = req.params;
        const response = await PostModel.findById(id).populate('author', ['username', 'email']);;
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error);

    }
}


export async function UpdatePost(req, res) {
    try {
        const { token } = req.cookies;
        const info = jwt.verify(token, process.env.JWT_SECRET);
        const newPath = req.file ? await uploadOnCloudinary(req.file.path) : null;
        const { id, title, summary, content } = req.body;
        const postDoc = await PostModel.findById(id);
        if (!postDoc) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const isAuthor = postDoc.author.toString() === info.id;

        if (!isAuthor) {
            return res.status(403).json({ msg: 'You are not the author' });
        }

        const updatedPost = await PostModel.findOneAndUpdate(
            { _id: id },
            { title, summary, content, cover: newPath ? newPath.url : postDoc.cover },
            { new: true } 
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}






