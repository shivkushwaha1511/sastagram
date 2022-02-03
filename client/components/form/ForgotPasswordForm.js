import { SyncOutlined } from "@ant-design/icons";

const ForgotPasswordForm = ({
  handleSubmit,
  email,
  setEmail,
  newPassword,
  setNewPassword,
  loading,
  secret,
  setSecret,
  page,
}) => (
  <form className="px-4 py-3" onSubmit={handleSubmit}>
    <div className="form-group mt-3">
      <label className="fw-bold">Email address</label>
      <input
        value={email}
        type="email"
        className="form-control"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    <div className="form-group mt-3">
      <label className="fw-bold">New password</label>
      <input
        value={newPassword}
        type="password"
        className="form-control"
        placeholder="Enter new password"
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>

    <div className="form-group mt-3">
      <label className="fw-bold">Pick a question</label>
      <select className="form-control">
        <option>Your favorite movie?</option>
        <option>Your favorite food?</option>
        <option>Your favorite teacher name?</option>
        <option>Your best friend name</option>
        <option>Your pet name?</option>
      </select>
      <small>You can use this to reset password</small>
    </div>

    <div className="form-group mt-2">
      <input
        value={secret}
        type="text"
        className="form-control"
        placeholder="Enter your secret here"
        onChange={(e) => setSecret(e.target.value)}
      />
    </div>

    <div className="mt-4 d-grid">
      <button
        disabled={!email || !newPassword || !secret || loading}
        className="btn btn-warning text-white fw-bold fs-5"
      >
        {loading ? (
          <SyncOutlined spin twoToneColor="#fff" className="py-2" />
        ) : (
          "Reset"
        )}
      </button>
    </div>
  </form>
);

export default ForgotPasswordForm;
