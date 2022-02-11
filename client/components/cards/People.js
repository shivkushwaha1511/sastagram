import { List, Avatar } from "antd";
import { useContext } from "react";
import { UserContext } from "../../context";
import { userImage } from "../../functions";
import Link from "next/link";

const People = ({ people, handleFollow, handleUnfollow }) => {
  const [state] = useContext(UserContext);
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(user) => {
          return (
            state &&
            state.user &&
            state.user._id !== user._id && (
              <List.Item className="px-4">
                <List.Item.Meta
                  avatar={<Avatar src={userImage(user)} />}
                  title={
                    <div className="d-flex justify-content-between fw-bold">
                      <Link href={`/user/${user.username}`}>
                        <a className="text-dark fs-6">{user.username}</a>
                      </Link>
                      {state &&
                      state.user &&
                      user.follower.includes(state.user._id) ? (
                        <span
                          className="text-danger pt-1 pointer"
                          onClick={() => handleUnfollow(user)}
                        >
                          Unfollow
                        </span>
                      ) : (
                        <span
                          className="text-primary pt-1 pointer"
                          onClick={() => handleFollow(user)}
                        >
                          Follow
                        </span>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )
          );
        }}
      />
    </>
  );
};

export default People;
