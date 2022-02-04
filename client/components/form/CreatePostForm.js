const CreatePostForm = ({ postContent, setPostContent, postSubmit }) => {
  return (
    <div className="card">
      <div className="card-body">
        <form className="form-group">
          <textarea
            value={postContent}
            className="form-control"
            placeholder="Write something...."
            onChange={(e) => setPostContent(e.target.value)}
          ></textarea>
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
