import { List, Avatar } from "antd";
import { userImage } from "../../functions";

const People = ({ people, handleFollow }) => {
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(user) => (
          <List.Item className="px-4">
            <List.Item.Meta
              avatar={<Avatar src={userImage(user)} />}
              title={
                <div className="d-flex justify-content-between fw-bold">
                  <span className="fs-6">{user.username}</span>
                  <span
                    className="text-primary pt-1 pointer"
                    onClick={() => handleFollow(user)}
                  >
                    Follow
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default People;
