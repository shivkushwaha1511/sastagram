import UserRoute from "../../components/routes/UserRoute";
import CreatePostForm from "../../components/form/CreatePostForm";
import { UserContext } from "../../context";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [state, setState] = useContext(UserContext);
  const [postContent, setPostContent] = useState("");

  const postSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/create-post", {
        postContent,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Post created");
        setPostContent("");
      }
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
            <CreatePostForm
              postContent={postContent}
              setPostContent={setPostContent}
              postSubmit={postSubmit}
            />
          </div>
          <div className="col-md-4">Sidebar</div>
        </div>
      </div>
    </UserRoute>
  );
};

export default Dashboard;
