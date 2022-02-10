import UserRoute from "../../components/routes/UserRoute";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Post from "../../components/cards/Post";
import { Modal } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const comments = () => {
  const router = useRouter();
  const _id = router.query._id;

  const [post, setPost] = useState({});

  // Comments state
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  const fetchPost = async () => {
    const { data } = await axios.get(`/current-post/${_id}`);
    setPost(data);
  };

  // Deleting Post
  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;

      const { data } = await axios.delete(`/delete-post/${post._id}`);
      toast.error("Post deleted");
      router.push("/user/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  // Handle Like & Unlike
  const handleLike = async (_id) => {
    try {
      const { data } = await axios.put("/like-post", { _id });
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (_id) => {
    console.log(_id);
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      fetchPost();
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

      console.log(data);

      fetchPost();
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
      fetchPost();
    } catch (err) {
      console.log(err);
    }
    // console.log(postId, comment);
  };

  return (
    <UserRoute>
      {/* <Post post={post} /> */}
      <div className="py-5 col-8 offset-2">
        <Post
          post={post}
          handleDelete={handleDelete}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          handleComment={handleComment}
          number={100}
          commentPage={true}
          handleDeleteComment={handleDeleteComment}
        />
        <RollbackOutlined
          className="fw-bold h5 pointer d-flex justify-content-center"
          onClick={() => router.push("/user/dashboard")}
        />
      </div>

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
    </UserRoute>
  );
};

export default comments;
