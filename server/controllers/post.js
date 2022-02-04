import Post from "../models/post";

export const createPost = async (req, res) => {
  const { postContent } = req.body;

  if (!postContent) {
    return res.json({
      error: "Description is required",
    });
  }

  try {
    const post = new Post({ postContent, postedBy: req.user._id });
    post.save();
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
