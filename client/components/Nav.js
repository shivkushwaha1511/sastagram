import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const Nav = () => {
  const [current, setCurrent] = useState("");
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  //For making link active acc. to current page
  useEffect(() => {
    setCurrent(process.browser && window.location.pathname);
    // console.log("path=>", current);
  }, [process.browser && window.location.pathname]);

  const logout = () => {
    window.localStorage.removeItem("auth");
    setState(null);
    router.push("/login");
  };

  return (
    <nav className="navbar nav bg-warning" style={{ padding: 0 }}>
      <Link href="/" className="nav-item">
        <a className="display-5 fw-bold text-white ps-3 mb-2">ShareMe</a>
      </Link>

      {/* <h2 className="display-5 fw-bold text-white ps-3 mb-2">ShareMe</h2> */}
      {/* <Link href="/" className="nav-item">
        <a className="nav-link text-white fw-bold fs-5 ms-auto">Home</a>
      </Link> */}

      {state ? (
        <>
          <Link href="/user/dashboard" className="nav-item">
            <a
              className={`nav-link text-white fw-bold fs-5 ms-auto rounded-pill ${
                current === "/user/dashboard" && "active"
              }`}
            >
              {state && state.user && state.user.name}
            </a>
          </Link>

          <a
            onClick={logout}
            className="nav-link text-white fw-bold fs-5 ps-3 me-2"
          >
            Logout
          </a>
        </>
      ) : (
        <>
          <Link href="/register" className="nav-item">
            <a
              className={`nav-link text-white fw-bold fs-5 ms-auto rounded-pill ${
                current === "/register" && "active"
              }`}
            >
              Register
            </a>
          </Link>

          <Link href="/login" className="nav-item">
            <a
              className={`nav-link text-white fw-bold fs-5 ps-3 me-2 rounded-pill ${
                current === "/login" && "active"
              }`}
            >
              Login
            </a>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Nav;
