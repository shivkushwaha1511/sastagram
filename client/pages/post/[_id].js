import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Post from "../../components/cards/Post";
import { Modal } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { UserContext } from "../../context";
import Head from "next/head";

const comments = (data) => {
  const router = useRouter();
  const _id = router.query._id;

  const [post, setPost] = useState(data);

  const [state] = useContext(UserContext);

  // Comments state
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  const fetchPost = async () => {
    const post = await axios.get(`/current-post/${_id}`);
    setPost(post.data);
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

  // Head tags
  const userImage = () => {
    if (post && post.image && post.image.url) {
      return post.image.url;
    } else {
      return "/images/user.png";
    }
  };

  const head = () => (
    <Head>
      <title>SastaGram-Do masti with dogs</title>
      <meta name="description" content={post.postContent} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="sastagram" />
      <meta property="og:url" content={`http://localhost:3000/post/${_id}`} />
      <meta property="og:description" content={post.about} />
      <meta property="og:image:secure_url" content={userImage()} />
    </Head>
  );

  return (
    <>
      {head()}
      <div className="py-5 col-md-8 offset-md-2 px-3">
        <Post
          post={post}
          handleDelete={handleDelete}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          handleComment={handleComment}
          number={100}
          commentPage={true}
          handleDeleteComment={handleDeleteComment}
          home={state && state.user ? false : true}
        />
        <RollbackOutlined
          className="fw-bold h5 pointer d-flex justify-content-center"
          onClick={() =>
            router.push(`${state && state.user ? "/user/dashboard" : "/"}`)
          }
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
    </>
  );
};

export async function getServerSideProps(context) {
  const { data } = await axios.get(`/current-post/${context.params._id}`);

  return {
    props: data,
  };
}

export default comments;
