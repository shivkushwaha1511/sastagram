import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../context";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";
import UserRoute from "../../components/routes/UserRoute";
import People from "../../components/cards/People";

const following = () => {
  const [state, setState] = useContext(UserContext);
  const [people, setPeople] = useState([]);

  //   Fetch following
  useEffect(() => {
    if (state && state.token) fetchFollowing();
  }, [state && state.token]);

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get("/user-following");
      setPeople(data);
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
      // Filter out records of people you may know
      const reco = people.filter((p) => p._id !== user._id);
      setPeople(reco);

      fetchFollowing();
      toast.error(`Unfollowed ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserRoute>
      <div className="col-md-6 offset-md-3 py-3 px-5">
        <div className="px-2 h4 fw-bold">
          <u>All following</u>
        </div>
        <People people={people} handleUnfollow={handleUnfollow} />
        <Link href="/user/dashboard" className="my-3">
          <a className="text-dark">
            <RollbackOutlined className="h5 d-flex justify-content-center pointer" />
          </a>
        </Link>
      </div>
    </UserRoute>
  );
};

export default following;
