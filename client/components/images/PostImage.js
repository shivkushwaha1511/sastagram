const PostImage = ({ url }) => (
  <div
    style={{
      backgroundImage: `url(${url})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundSize: "contain",
      height: "450px",
    }}
  ></div>
);

export default PostImage;
