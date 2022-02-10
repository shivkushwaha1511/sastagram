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
import { useRouter } from "next/router";
import { userImage } from "../../functions";

const PostList = ({ posts, handleDelete, handleLike, handleUnlike }) => {
  const [state] = useContext(UserContext);

  const router = useRouter();

  return (
    <>
      {posts &&
        posts.map((post) => (
          <div key={post._id} className="card mb-4">
            <div className="card-header d-flex">
              {/* Image/name/date */}
              {/* <Avatar size={40}>{post.postedBy.name[0]}</Avatar> */}
              <Avatar size={40} src={userImage(post.postedBy)} />

              <span className="ms-3 pt-2 flex-grow-1 fw-bold">
                {post.postedBy.name}
              </span>
              <span className="pt-2">{moment(post.createdAt).fromNow()}</span>
            </div>
            <div className="card-body">{renderHTML(post.postContent)}</div>
            <div className="card-footer">
              {post.image && <PostImage url={post.image.url} />}
              <div className="mt-3 d-flex">
                {state && state.user && post.likes.includes(state.user._id) ? (
                  <HeartFilled
                    className="text-danger h5 me-2 pointer"
                    onClick={() => handleUnlike(post._id)}
                  />
                ) : (
                  <HeartOutlined
                    className="text-danger h5 me-2 pointer"
                    onClick={() => handleLike(post._id)}
                  />
                )}

                <div className="me-3">
                  {post.likes && post.likes.length} like
                </div>

                <CommentOutlined className="h5 me-2 pointer" />
                <div className="me-3 flex-grow-1">4 comments</div>

                {state && state.user && state.user._id === post.postedBy._id && (
                  <>
                    <EditOutlined
                      onClick={() => router.push(`/user/post/${post._id}`)}
                      className="h5 me-4 pointer"
                    />

                    <DeleteOutlined
                      className="h5 me-2 text-danger pointer"
                      onClick={() => handleDelete(post)}
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
