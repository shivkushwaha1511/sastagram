import { List, Avatar } from "antd";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";
import UserRoute from "../../components/routes/UserRoute";
import { userImage } from "../../functions";

const follower = () => {
  const [state] = useContext(UserContext);
  const [people, setPeople] = useState([]);

  //   Fetch following
  useEffect(() => {
    if (state && state.token) fetchFollowing();
  }, [state && state.token]);

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get("/user-follower");
      setPeople(data);
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
        <List
          itemLayout="horizontal"
          dataSource={people}
          renderItem={(user) => (
            <List.Item className="px-5">
              <List.Item.Meta
                avatar={<Avatar src={userImage(user)} />}
                title={
                  <div className="d-flex justify-content-between fw-bold">
                    <span className="fs-6">{user.username}</span>
                  </div>
                }
              />
            </List.Item>
          )}
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
