import Post from "../models/post";
import cloudinary from "cloudinary";
import User from "../models/user";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Saving post
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

//save image and return image url and public id
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

//For fetching posts
export const userPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let following = user.following;
    following.push(user._id);

    const posts = await Post.find({ postedBy: following })
      .populate("postedBy", "_id name image")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

//For fetching to be editted post
export const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

// Updating post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    });
    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params._id);
    // Delete from cloudinary
    if (post.image && post.image.public_id) {
      cloudinary.uploader.destroy(post.image.public_id);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};
