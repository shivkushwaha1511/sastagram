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
import Link from "next/link";

const Post = ({
  post,
  handleDelete,
  handleLike,
  handleUnlike,
  handleComment,
  number = 2,
  commentPage,
  handleDeleteComment,
}) => {
  const [state] = useContext(UserContext);

  const router = useRouter();

  return (
    <>
      {post && post.postedBy && (
        <div className="card mb-4">
          <div className="card-header d-flex">
            {/* Image/name/date */}
            {/* <Avatar size={40}>{post.postedBy.name[0]}</Avatar> */}
            <Avatar size={40} src={userImage(post.postedBy)} />

            <span className="ms-3 pt-1 fs-5 flex-grow-1 fw-bold">
              {post.postedBy.username}
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

              <div className="me-3 fw-bold">
                {post.likes && post.likes.length} like
              </div>

              <CommentOutlined
                className="h5 me-2 pointer"
                onClick={() => handleComment(post)}
              />

              <div className="me-3 flex-grow-1 fw-bold">
                {commentPage ? (
                  `${post.comments.length} comments`
                ) : (
                  <Link href={`/post/${post._id}`}>
                    <a className="text-dark">{post.comments.length} comments</a>
                  </Link>
                )}
              </div>

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

            <ul
              className="list-group"
              style={{ maxHeight: "200px", overflow: "auto" }}
            >
              {post.comments &&
                post.comments.length > 0 &&
                post.comments.slice(0, number).map((comm) => (
                  <li
                    key={comm._id}
                    className="list-group-item d-flex justify-content-between align-items-start px-5"
                  >
                    <Avatar size={20} src={userImage(comm.postedBy)} />
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{comm.postedBy.username}</div>
                      {comm.text}
                    </div>
                    <div>
                      <span className="badge bg-warning rounded-pill">
                        {moment(comm.created).fromNow()}
                      </span>
                      {state &&
                        state.user &&
                        comm.postedBy._id === state.user._id && (
                          <DeleteOutlined
                            className="text-danger h6 mt-2 ps-3 pointer"
                            onClick={() => handleDeleteComment(post._id, comm)}
                          />
                        )}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
