import bcrypt from "bcrypt";

export const hashedPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) reject(err);

      bcrypt.hash(password, salt, (e, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
};

export const compare = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};
