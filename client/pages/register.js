import Head from "next/head";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name, email, password, secret);
    axios
      .post("http://localhost:8000/api/register", {
        name,
        email,
        password,
        secret,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/form.css" />
      </Head>
      <div className="container-fluid">
        <div className="row py-4">
          <div
            className="col-md-4 my-4 offset-md-4 bg-white shadow-lg"
            style={{ padding: "0" }}
          >
            <div className="bg-warning form_top"></div>
            <div className="text-center display-4 fw-bold pt-1">Register</div>
            <form className="px-4 py-3" onSubmit={handleSubmit}>
              <div className="form-group mt-1">
                <label className="fw-bold">Name</label>
                <input
                  value={name}
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
                <label className="fw-bold">Password</label>
                <input
                  value={password}
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
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
                <button className="btn btn-warning text-white fw-bold fs-5">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
