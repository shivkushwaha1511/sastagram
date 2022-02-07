import { Avatar } from "antd";
import moment from "moment";
import renderHTML from "react-render-html";
import PostImage from "../images/PostImage";
import {
  HeartFilled,
  HeartOutlined,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { UserContext } from "../../context";
import { useContext } from "react";

const PostList = ({ posts }) => {
  const [state] = useContext(UserContext);

  return (
    <>
      {posts &&
        posts.map((post) => (
          <div key={post._id} className="card mb-4">
            <div className="card-header d-flex">
              {/* Image/name/date */}
              <Avatar size={40}>{post.postedBy.name[0]}</Avatar>
              <span className="ms-3 pt-2 flex-grow-1 fw-bold">
                {post.postedBy.name}
              </span>
              <span className="pt-2">{moment(post.createdAt).fromNow()}</span>
            </div>
            <div className="card-body">{renderHTML(post.postContent)}</div>
            <div className="card-footer">
              {post.image && <PostImage url={post.image.url} />}
              <div className="mt-3 d-flex">
                <HeartOutlined className="text-danger h5 me-2" tabIndex={0} />
                <div className="me-3">3 like</div>
                <CommentOutlined className="h5 me-2" tabIndex={0} />
                <div className="me-3 flex-grow-1">4 comments</div>
                {state && state.user && state.user._id === post.postedBy._id && (
                  <>
                    <EditOutlined className="h5 me-4" tabIndex={0} />
                    <DeleteOutlined
                      className="h5 me-2 text-danger"
                      tabIndex={0}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default PostList;
