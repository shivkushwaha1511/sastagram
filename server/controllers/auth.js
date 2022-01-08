import User from "../models/user";
import { hashedPassword } from "../helpers/auth";

export const register = async (req, res) => {
  // console.log(req.body);

  const { name, email, password, secret } = req.body;

  // Validation
  if (!name) res.status(400).send("Name is required");

  if (!password || password.length < 6)
    res.status(400).send("Password is required and must 6 characters long");

  if (!secret) res.status(400).send("Answer is required");

  // Email exists?
  const exist = await User.findOne({ email });
  if (exist) res.status(400).send("Email is taken");

  const hashed = await hashedPassword(password);

  // Creating model Obj.
  const user = new User({ name, email, password: hashed, secret });

  try {
    await user.save();
    res.json({
      ok: true,
    });
  } catch (err) {
    console.log("Register failed=>", err);
    res.status(400).send("Error! Try Again");
  }
};
