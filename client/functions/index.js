export const userImage = (user) => {
  if (user.image && user.image.url) {
    return user.image.url;
  } else {
    return "/images/user.png";
  }
};
