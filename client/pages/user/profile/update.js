import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Avatar, Modal } from "antd";
import AuthForm from "../../../components/form/AuthForm";
import { UserContext } from "../../../context";
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";
import UserRoute from "../../../components/routes/UserRoute";

const Register = () => {
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  // Profile image
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);

  const [state, setState] = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put("/profile-update", {
        username,
        name,
        email,
        password,
        secret,
        about,
        image,
      });

      if (data.error) {
        setLoading(false);
        toast.error(data.error);
      } else {
        // Updating context and local storage with updated user
        let auth = JSON.parse(localStorage.getItem("auth"));
        auth.user = data;
        localStorage.setItem("auth", JSON.stringify(auth));
        setState({ ...state, user: data });

        setOk(true);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state && state.user) {
      setUsername(state.user.username);
      setName(state.user.name);
      setAbout(state.user.about);
      setEmail(state.user.email);
      setImage(state.user.image);
    }
  }, [state && state.user]);

  // profile image upload
  const handleImageUpload = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await axios.post("/image-upload", formData);
      setImage(data);
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  return (
    <>
      <UserRoute>
        <div className="container-fluid">
          <div className="row">
            <div className="col" style={{ padding: 0 }}>
              <h1 className="display-3 fw-bold text-center text-white banner-img py-5">
                Profile
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <label
                className="d-flex justify-content-center"
                style={{ cursor: "pointer" }}
              >
                {image && image.url ? (
                  <Avatar size={200} src={image.url} className="mt-1 me-2" />
                ) : uploading ? (
                  <LoadingOutlined spin className="fs-4 mt-2 me-2" />
                ) : (
                  <CameraOutlined className="pt-2 fs-4 pe-2" />
                )}
                <input
                  onChange={handleImageUpload}
                  type="file"
                  accept="images/*"
                  hidden
                />
              </label>
              <AuthForm
                handleSubmit={handleSubmit}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                secret={secret}
                setSecret={setSecret}
                loading={loading}
                updatePage={true}
                username={username}
                setUsername={setUsername}
                about={about}
                setAbout={setAbout}
              />
            </div>
          </div>
        </div>

        <Modal
          title="Congragulations!"
          visible={ok}
          onCancel={() => setOk(false)}
          footer={null}
        >
          <p className="fs-5">You have successfully updated your profile.</p>
        </Modal>
      </UserRoute>
    </>
  );
};

export default Register;
