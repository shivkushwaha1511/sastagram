import UserRoute from "../../components/routes/UserRoute";
import PostForm from "../../components/form/PostForm";
import { UserContext } from "../../context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/People";
import Link from "next/link";
import { Modal } from "antd";
import Pagination from "@material-ui/lab/Pagination";
import SearchForm from "../../components/form/SearchForm";

const Dashboard = () => {
  const [state, setState] = useContext(UserContext);
  const [postContent, setPostContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);

  // Comments state
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  // Total posts(Pagination)
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const totalPost = async () => {
    try {
      const { data } = await axios.get(`/total-post/${state.user._id}`);
      setTotal(data);
    } catch (err) {
      console.log(err);
    }
  };

  //Fetching Posts
  useEffect(() => {
    if (state && state.token) {
      fetchUserPosts();
      findPeople();
    }
  }, [state && state.token, page]);

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get(`/user-posts/${page}`);
      setPosts(data);
      totalPost();
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
        setPage(1);
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

  // Handle Like & Unlike
  const handleLike = async (_id) => {
    try {
      const { data } = await axios.put("/like-post", { _id });
      fetchUserPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (_id) => {
    console.log(_id);
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      fetchUserPosts();
    } catch (err) {
      console.log(err);
    }
  };

  // Comment
  const handleComment = (post) => {
    setCurrentPost(post);
    setVisible(true);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put("/add-comment", {
        comment,
        postId: currentPost._id,
      });

      fetchUserPosts();
      setComment("");
      setCurrentPost({});
      setVisible(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (postId, comment) => {
    const ans = window.confirm("Are you sure?");
    if (!ans) return;

    try {
      const { data } = await axios.put("/remove-comment", {
        comment,
        postId,
      });
      fetchUserPosts();
    } catch (err) {
      console.log(err);
    }
    // console.log(postId, comment);
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
            <PostList
              posts={posts}
              handleDelete={handleDelete}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              handleComment={handleComment}
              handleDeleteComment={handleDeleteComment}
            />
            {/* <Pagination
              current={page}
              total={(total / 3) * 10}
              onChange={(value) => setPage(value)}
            /> */}
            <Pagination
              count={Math.ceil(total / 3)}
              page={page}
              onChange={(e, pg) => setPage(pg)}
            />
          </div>
          <div className="col-md-4 px-3">
            {state && state.user && (
              <div className="my-4 d-flex justify-content-between">
                <Link href="/user/following">
                  <a className="text-dark display-6">
                    {state.user.following && state.user.following.length}{" "}
                    Following
                  </a>
                </Link>
                <Link href="/user/follower">
                  <a className="text-dark display-6">
                    {state.user.following && state.user.follower.length}{" "}
                    Followers
                  </a>
                </Link>
              </div>
            )}

            <SearchForm findPeople={findPeople} />

            <div className="fs-5 fw-bold my-2 mt-4">
              <u>People you may know</u>
            </div>
            <People people={people} handleFollow={handleFollow} />
          </div>
        </div>

        {/* Comment Modal */}
        <Modal
          visible={visible}
          onCancel={() => {
            setVisible(false);
            setCurrentPost({});
          }}
          title="Post a comment"
          footer={null}
        >
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="Write something..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="text-center">
              <button className="btn btn-warning mt-3 text-white fw-bold">
                Comment
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </UserRoute>
  );
};

export default Dashboard;
