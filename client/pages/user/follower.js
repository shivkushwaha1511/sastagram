import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";
import UserRoute from "../../components/routes/UserRoute";
import People from "../../components/cards/People";
import { toast } from "react-toastify";

const follower = () => {
  const [state, setState] = useContext(UserContext);
  const [people, setPeople] = useState([]);

  //   Fetch following
  useEffect(() => {
    if (state && state.token) fetchFollower();
  }, [state && state.token]);

  const fetchFollower = async () => {
    try {
      const { data } = await axios.get("/user-follower");
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put("/follow-user", { _id: user._id });

      // Update localstorage and context
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });

      fetchFollower();
      toast.success(`Following ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put("/unfollow-user", { _id: user._id });

      // Update localstorage and context
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });

      fetchFollower();
      toast.error(`Unfollowed ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserRoute>
      <div className="col-6 offset-3 py-3">
        <div className="px-2 h4 fw-bold">
          <u>All followers</u>
        </div>

        <People
          people={people}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
        />

        <Link href="/user/dashboard" className="my-3">
          <a className="text-dark">
            <RollbackOutlined className="h5 d-flex justify-content-center pointer" />
          </a>
        </Link>
      </div>
    </UserRoute>
  );
};

export default follower;
