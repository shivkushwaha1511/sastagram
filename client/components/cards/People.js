import { List, Avatar } from "antd";

const People = ({ people, handleFollow }) => {
  const userImage = (user) => {
    if (user.image && user.image.url) {
      return user.image.url;
    } else {
      return "/images/user.png";
    }
  };

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
