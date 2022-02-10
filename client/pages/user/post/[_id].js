import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserRoute from "../../../components/routes/UserRoute";
import PostForm from "../../../components/form/PostForm";
import { RollbackOutlined } from "@ant-design/icons";

const EditPost = () => {
  const router = useRouter();
  const _id = router.query._id;

  // state
  const [post, setPost] = useState({});
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  // Fetch post
  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/current-post/${_id}`);
      setPost(data);
      setPostContent(data.postContent);
      setImage(data.image);
    } catch (err) {
      console.log(err);
    }
  };

  // Update post
  const postSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/post-update/${_id}`, {
        postContent,
        image,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Post updated");
        router.push("/user/dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //image upload and get url
  const handleImageUpload = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await axios.post("/image-upload", formData);
      setImage(data);
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  return (
    //UserRoute - For validating user is loggedin or not
    <UserRoute>
      <div className="container-fluid">
        <div className="row">
          <div className="col" style={{ padding: 0 }}>
            <h1 className="display-3 fw-bold text-center text-white banner-img py-5">
              Dashboard
            </h1>
          </div>
        </div>

        <div className="row py-3">
          <div className="col-md-8 px-4 offset-2">
            <PostForm
              postContent={postContent}
              setPostContent={setPostContent}
              postSubmit={postSubmit}
              handleImageUpload={handleImageUpload}
              image={image}
              uploading={uploading}
            />
          </div>
        </div>

        <RollbackOutlined
          className="fw-bold h5 pointer d-flex justify-content-center"
          onClick={() => router.push("/user/dashboard")}
        />
      </div>
    </UserRoute>
  );
};

export default EditPost;
