import User from "../models/user";
import { hashedPassword, compare } from "../helpers/auth";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const register = async (req, res) => {
  // console.log(req.body);

  const { name, email, password, secret } = req.body;

  // Validation
  if (!name) {
    return res.json({
      error: "Name is required",
    });
  }
  if (!password || password.length < 6) {
    return res.json({
      error: "Password is required and must 6 characters long",
    });
  }

  if (!secret) {
    return res.json({
      error: "Answer is required",
    });
  }

  // Email exists?
  const exist = await User.findOne({ email });
  if (exist) {
    return res.json({
      error: "Email is taken",
    });
  }

  const hashed = await hashedPassword(password);

  // Creating model Obj.
  const user = new User({
    name,
    email,
    password: hashed,
    secret,
    username: nanoid(6),
  });

  try {
    await user.save();
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("Register failed=>", err);
    return res.json({
      error: "Error! Try Again",
    });
  }
};

export const login = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    //Checking user exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }

    //checking password
    const match = await compare(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }

    //Generating token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //We not want to expose password & secret
    user.password = undefined;
    user.secret = undefined;

    //sending response
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Error! Try again",
    });
  }
};

//authenticating user for accessing pages if loggedin
export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // res.json(user);
    res.json({
      ok: true,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
  const user = User.findById(req.user._id);
};

export const forgotPassword = async (req, res) => {
  const { email, newPassword, secret } = req.body;

  //Validation
  if (!newPassword && newPassword.length < 6) {
    return res.json({
      error: "New password is required and minimum 6 characters long",
    });
  }

  if (!secret) {
    return res.json({
      error: "Secret is required",
    });
  }

  const user = await User.findOne({ email, secret });
  if (!user) {
    return res.json({
      error: "We can't verify you with these credentials",
    });
  }

  try {
    const hashed = await hashedPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({
      success: "Congrats! Now you can login with your new password",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong! Try again",
    });
  }
};

// User Profile Update
export const profileUpdate = async (req, res) => {
  try {
    const data = {};

    if (req.body.username) {
      data.username = req.body.username;
    }

    if (req.body.about) {
      data.about = req.body.about;
    }

    if (req.body.name) {
      data.name = req.body.name;
    }

    if (req.body.image) {
      data.image = req.body.image;
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.json({ error: "Password minimum 6 characters long" });
      } else {
        data.password = await hashedPassword(req.body.password);
      }
    }

    if (req.body.secret) {
      data.secret = req.body.secret;
    }

    let user = await User.findByIdAndUpdate(req.user._id, data, { new: true });
    user.password = undefined;
    user.secret = undefined;
    res.json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res.json({ error: "Username taken" });
    }
    console.log(err);
  }
};

// Fetch people that are not Followed by user
export const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = user.following;
    following.push(user._id);

    const people = await User.find({ _id: { $nin: following } })
      .select("-password -secret")
      .limit(10);
    res.json(people);
  } catch (err) {
    console.log(err);
  }
};

// Add follower to followed user
// As middleware
export const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { follower: req.user._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

// Add following to current user
export const addFollowing = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

// Remove follower to followed user
// As middleware
export const removeFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { follower: req.user._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

// Remove following to current user
export const removeFollowing = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

// Fetch following of user
export const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = await User.find({ _id: user.following })
      .select("-password -secret")
      .limit(10);
    res.json(following);
  } catch (err) {
    console.log(err);
  }
};

// Fetch followers of user
export const userFollower = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const follower = await User.find({ _id: user.follower })
      .select("-password -secret")
      .limit(10);
    res.json(follower);
  } catch (err) {
    console.log(err);
  }
};

// Search user
export const searchUser = async (req, res) => {
  const query = req.params.query;
  try {
    const user = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

// Fetch User from username
export const fetchUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -secret"
    );
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};
