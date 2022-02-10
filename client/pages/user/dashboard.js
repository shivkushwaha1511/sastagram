import UserRoute from "../../components/routes/UserRoute";
import PostForm from "../../components/form/PostForm";
import { UserContext } from "../../context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/People";
import Link from "next/link";

const Dashboard = () => {
  const [state, setState] = useContext(UserContext);
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);

  //Fetching Posts
  useEffect(() => {
    if (state && state.token) {
      fetchUserPosts();
      findPeople();
    }
  }, [state && state.token]);

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get("/user-posts");
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch people that are not Followed by user
  const findPeople = async () => {
    const { data } = await axios.get("/find-people");
    setPeople(data);
  };

  // Submitting Post
  const postSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/create-post", {
        postContent,
        image,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        fetchUserPosts();
        toast.success("Post created");
        setPostContent("");
        setImage({});
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

  // Deleting Post
  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;

      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.error("Post deleted");
      fetchUserPosts();
    } catch (err) {
      console.log(err);
    }
  };

  //Handle follow
  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put("/follow-user", { _id: user._id });

      // Update localstorage and context
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });
      // Filter out records of people you may know
      const reco = people.filter((p) => p._id !== user._id);
      setPeople(reco);

      fetchUserPosts();
      toast.success(`Following ${user.name}`);
    } catch (err) {
      console.log(err);
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
          <div className="col-md-8 px-4">
            <PostForm
              postContent={postContent}
              setPostContent={setPostContent}
              postSubmit={postSubmit}
              handleImageUpload={handleImageUpload}
              image={image}
              uploading={uploading}
            />
            <PostList posts={posts} handleDelete={handleDelete} />
          </div>
          <div className="col-md-4 px-3">
            {state && state.user && (
              <div className="h6 fw-bold my-4 px-5 d-flex justify-content-between">
                <Link href="/user/following">
                  <a className="text-dark">
                    {state.user.following && state.user.following.length}{" "}
                    Following
                  </a>
                </Link>
                <Link href="/user/follower">
                  <a className="text-dark">
                    {state.user.following && state.user.follower.length}{" "}
                    Followers
                  </a>
                </Link>
              </div>
            )}

            <div className="fs-5 fw-bold my-2">
              <u>People you may know</u>
            </div>
            <People people={people} handleFollow={handleFollow} />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default Dashboard;
