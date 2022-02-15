// This page is for Authenticating Admin User to access admin

import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";

const AdminRoute = ({ children }) => {
  const [ok, setOk] = useState(false);
  const [state] = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    if (state && state.token) getCurrentUser();
  }, [state && state.token]);

  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get("/current-admin");

      if (data.ok) setOk(true);
    } catch (err) {
      return router.push("/");
    }
  };

  //If token not in local storage
  process.browser &&
    state == null &&
    setTimeout(() => {
      getCurrentUser();
    }, 1000);

  return !ok ? (
    <LoadingOutlined
      spin
      className="d-flex justify-content-center display-1 mt-5"
    />
  ) : (
    <>{children}</>
  );
};

export default AdminRoute;
