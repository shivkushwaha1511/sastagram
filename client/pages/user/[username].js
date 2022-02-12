import { ClockCircleOutlined, RollbackOutlined } from "@ant-design/icons";
import { Card } from "antd";
import axios from "axios";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { userImage } from "../../functions";

const Username = (prop) => {
  const router = useRouter();
  const username = router.query.username;
  const { Meta } = Card;

  const [state] = useContext(UserContext);

  //   state
  const [user, setUser] = useState(prop);

  const fetchUser = async () => {
    const { data } = await axios.get(`/fetch-user/${username}`);
    setUser(data);
  };

  useEffect(() => {
    if (username) fetchUser();
  }, []);

  // Head tags
  const userImg = () => {
    if (user && user.image && user.image.url) {
      return user.image.url;
    } else {
      return "/images/user.png";
    }
  };

  const head = () => (
    <Head>
      <title>SastaGram-Do masti with dogs</title>
      <meta name="description" content={user.about} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="sastagram" />
      <meta
        property="og:url"
        content={`http://localhost:3000/user/${user.username}`}
      />
      <meta property="og:description" content={user.about} />
      <meta property="og:image:secure_url" content={userImg()} />
    </Head>
  );

  return (
    <>
      {head()}
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
          onClick={() =>
            router.push(`${state && state.user ? "/user/dashboard" : "/"}`)
          }
        />
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { data } = await axios.get(`/fetch-user/${context.params.username}`);
  return {
    props: data,
  };
}

export default Username;
