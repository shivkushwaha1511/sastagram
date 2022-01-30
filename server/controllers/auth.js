import User from "../models/user";
import { hashedPassword, compare } from "../helpers/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  // console.log(req.body);

  const { name, email, password, secret } = req.body;

  // Validation
  if (!name) return res.status(400).send("Name is required");

  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and must 6 characters long");

  if (!secret) return res.status(400).send("Answer is required");

  // Email exists?
  const exist = await User.findOne({ email });
  if (exist) return res.status(400).send("Email is taken");

  const hashed = await hashedPassword(password);

  // Creating model Obj.
  const user = new User({ name, email, password: hashed, secret });

  try {
    await user.save();
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("Register failed=>", err);
    return res.status(400).send("Error! Try Again");
  }
};

export const login = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    //Checking user exists or not
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("No user found");

    //checking password
    const match = await compare(password, user.password);
    if (!match) return res.status(400).send("Wrong password");

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
    return res.status(400).send("Error! Try again");
  }
};
