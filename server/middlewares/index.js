import expressJwt from "express-jwt";
import Post from "../models/post";
import User from "../models/user";

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

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "Admin") {
      return res.status(400).send("Unauthorized");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
