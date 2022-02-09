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

//authenticating user for accessing dashboard if loggedin
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
    res.json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res.json({ error: "Username taken" });
    }
    console.log(err);
  }
};
