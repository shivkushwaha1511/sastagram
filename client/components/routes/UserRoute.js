import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { UserContext } from "../../context";

const UserRoute = ({ children }) => {
  const [ok, setOk] = useState(false);
  const [state] = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    if (state && state.token) getCurrentUser();
  }, [state && state.token]);

  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/current-user`,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      if (data.ok) setOk(true);
    } catch (err) {
      router.push("/login");
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

export default UserRoute;
