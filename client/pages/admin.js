import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AdminRoute from "../components/routes/AdminRoute";
import { UserContext } from "../context";
import { List } from "antd";
import renderHTML from "react-render-html";

const Admin = () => {
  const [state] = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  //Fetching Posts
  useEffect(() => {
    if (state && state.token) {
      fetchAllPosts();
    }
  }, [state && state.token]);

  const fetchAllPosts = async () => {
    try {
      const { data } = await axios.get(`/all-posts`);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Deleting Post
  const handleDelete = async (post) => {
    try {
      const answer = window.confirm("Are you sure?");
      if (!answer) return;

      const { data } = await axios.delete(`/admin-delete-post/${post._id}`);
      toast.error("Post deleted");
      fetchAllPosts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    //UserRoute - For validating user is loggedin or not
    <AdminRoute>
      <div className="container-fluid">
        <div className="row">
          <div className="col" style={{ padding: 0 }}>
            <h1 className="display-3 fw-bold text-center text-white banner-img py-5">
              Admin
            </h1>
          </div>
        </div>

        <div className="row d-flex justify-content-center py-5">
          <div className="col-8">
            <List
              itemLayout="horizontal"
              dataSource={posts}
              renderItem={(post) => (
                <List.Item className="px-3">
                  <List.Item.Meta
                    title={post.postedBy.username}
                    description={renderHTML(post.postContent)}
                  />
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(post)}
                  >
                    Delete
                  </button>
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;
