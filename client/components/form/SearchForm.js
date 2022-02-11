import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../context";
import People from "../cards/People";
import { toast } from "react-toastify";

const SearchForm = ({ findPeople }) => {
  // Search User
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [noUser, setNoUser] = useState(false);
  const [state, setState] = useContext(UserContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    searchUser();
  };

  const searchUser = async () => {
    try {
      const { data } = await axios.get(`/search-user/${search}`);
      if (data.length === 0) setNoUser(true);
      setResult(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put("/follow-user", { _id: user._id });

      // Update localstorage and context
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });

      searchUser();
      findPeople();
      toast.success(`Following ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put("/unfollow-user", { _id: user._id });

      // Update localstorage and context
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem("auth", JSON.stringify(auth));
      setState({ ...state, user: data });

      searchUser();
      findPeople();
      toast.error(`Unfollowed ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form
        className="form-inline row d-flex justify-content-center px-5 mb-2"
        onSubmit={handleSearch}
      >
        <div className="col-8">
          <input
            value={search}
            type="search"
            onChange={(e) => {
              setSearch(e.target.value);
              setResult([]);
              setNoUser(false);
            }}
            className="form-control"
          />
        </div>
        <div className="col-2" style={{ padding: 0 }}>
          <button className="btn btn-warning text-white" type="submit">
            <SearchOutlined className="fs-5" />
          </button>
        </div>
      </form>
      {!noUser ? (
        result.length > 0 && (
          <People
            people={result}
            handleUnfollow={handleUnfollow}
            handleFollow={handleFollow}
          />
        )
      ) : (
        <div className="text-center fs-5 fw-bold pt-3">No user found</div>
      )}
    </>
  );
};

export default SearchForm;
