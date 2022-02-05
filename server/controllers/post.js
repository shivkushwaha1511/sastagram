import Post from "../models/post";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const createPost = async (req, res) => {
  const { postContent, image } = req.body;

  if (!postContent) {
    return res.json({
      error: "Description is required",
    });
  }

  try {
    const post = new Post({ postContent, image, postedBy: req.user._id });
    post.save();
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const imageUpload = async (req, res) => {
  // console.log(req.files);
  try {
    const result = await cloudinary.uploader.upload(req.files.image.path);
    // console.log(result);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.log(error);
  }
};
