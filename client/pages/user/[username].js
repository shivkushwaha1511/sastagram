import { ClockCircleOutlined, RollbackOutlined } from "@ant-design/icons";
import { Card } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { userImage } from "../../functions";

const Username = () => {
  const router = useRouter();
  const username = router.query.username;
  const { Meta } = Card;

  //   state
  const [user, setUser] = useState({});

  const fetchUser = async () => {
    const { data } = await axios.get(`/fetch-user/${username}`);
    setUser(data);
  };

  useEffect(() => {
    if (username) fetchUser();
  });

  return (
    <div className="py-5">
      <div className="d-flex justify-content-center mb-4 pt-3">
        <Card
          hoverable
          style={{ width: 320 }}
          cover={<img alt="example" src={userImage(user)} />}
        >
          <div>
            <Meta title={user.username} />
          </div>
          <div className="text-muted ps-2">{user.name}</div>
          <div className="my-2 fs-6">{user.about}</div>
          <div className="mb-2">
            <ClockCircleOutlined className="me-2 fs-5" />
            Joined {moment(user.createdAt).fromNow()}
          </div>
          <div className="fw-bold mt-3" style={{ fontSize: "20px" }}>
            <span>{user.follower && user.follower.length} Followers</span>
            <span className="float-end">
              {user.following && user.following.length} Following
            </span>
          </div>
        </Card>
      </div>
      <RollbackOutlined
        className="fw-bold h5 pointer d-flex justify-content-center"
        onClick={() => router.push("/user/dashboard")}
      />
    </div>
  );
};
export default Username;
