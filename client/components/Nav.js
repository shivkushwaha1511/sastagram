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
    <nav className="nav d-flex bg-warning py-1">
      <Link href="/" className="nav-item">
        <a className="display-6 fw-bold text-white ps-3 mb-2 flex-grow-1">
          ShareMe
        </a>
      </Link>

      {state ? (
        <>
          <div className="dropdown pt-1 pe-2">
            <a
              className="btn dropdown-toggle text-white fw-bold fs-5"
              data-bs-toggle="dropdown"
            >
              {state && state.user && state.user.name}
            </a>
            <ul className="dropdown-menu">
              <li>
                <Link href="/user/dashboard">
                  <a
                    className={`nav-link dropdown-item fw-bold text-dark ${
                      current === "/user/dashboard" &&
                      "active bg-warning text-white"
                    }`}
                  >
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/user/profile/update">
                  <a
                    className={`nav-link dropdown-item fw-bold text-dark ${
                      current === "/user/profile/update" &&
                      "active bg-warning text-white"
                    }`}
                  >
                    Profile
                  </a>
                </Link>
              </li>
              <li>
                <a
                  onClick={logout}
                  className="nav-link dropdown-item text-dark fw-bold"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <Link href="/register">
            <a
              className={`nav-link text-white fw-bold fs-5 rounded-pill pt-2 me-1 px-2 ${
                current === "/register" && "active"
              }`}
              style={{ padding: 0 }}
            >
              Register
            </a>
          </Link>

          <Link href="/login">
            <a
              className={`nav-link text-white fw-bold fs-5 ps-3 me-2 rounded-pill pt-2 ${
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
