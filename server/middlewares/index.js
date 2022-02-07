import expressJwt from "express-jwt";
import Post from "../models/post";

export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export const canUpdatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params._id);
    // console.log(req.params._id + " $$ " + req.user._id);
    if (post.postedBy != req.user._id) {
      return res.json({
        error: "Unauthorized access",
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
