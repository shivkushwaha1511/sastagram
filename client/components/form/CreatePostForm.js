import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const CreatePostForm = ({ postContent, setPostContent, postSubmit }) => {
  return (
    <div className="card">
      <div className="card-body">
        <form className="form-group">
          <ReactQuill
            theme="snow"
            value={postContent}
            className="form-control"
            placeholder="Write something...."
            onChange={(e) => setPostContent(e)}
          />
        </form>
      </div>
      <div className="card-footer">
        <button
          onClick={postSubmit}
          disabled={!postContent}
          className="btn btn-warning text-white"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePostForm;
