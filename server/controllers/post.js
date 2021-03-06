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
    await post.save();
    const postWithUser = await Post.findById(post._id).populate(
      "postedBy",
      "_id name image username"
    );
    return res.json(postWithUser);
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

    // Pagination
    const currnetPage = req.params.page || 1;
    const perPage = 3;

    const posts = await Post.find({ postedBy: following })
      .skip((currnetPage - 1) * perPage)
      .populate("postedBy", "_id name image username")
      .populate("comments.postedBy", "_id name image username")
      .sort({ createdAt: -1 })
      .limit(perPage);

    posts.map((post) => post.comments.reverse());
    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

//For fetching the under observation post
export const currentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id)
      .populate("postedBy", "_id name image username")
      .populate("comments.postedBy", "_id name image username");

    post.comments.reverse();
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

// Like unlike
export const likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

// Comment
export const addComment = async (req, res) => {
  try {
    const { comment, postId } = req.body;
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { text: comment, postedBy: req.user._id } },
      },
      { new: true }
    )
      .populate("postedBy", "_id name image username")
      .populate("comments.postedBy", "_id name image username");

    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

export const removeComment = async (req, res) => {
  try {
    const { comment, postId } = req.body;
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: { _id: comment._id } },
      },
      { new: true }
    )
      .populate("postedBy", "_id name image username")
      .populate("comments.postedBy", "_id name image username");

    res.json(post);
  } catch (err) {
    console.log(err);
  }
};

// Total posts
export const totalPost = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    const following = user.following;
    following.push(user._id);
    const posts = await Post.find({
      postedBy: { $in: following },
    });
    res.json(posts.length);
  } catch (err) {
    console.log(err);
  }
};

// Fetch all posts
export const allPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name image username")
      .sort({ createdAt: -1 })
      .limit(12);

    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};
