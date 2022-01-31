import { useContext } from "react";
import { UserContext } from "../context";

const Home = () => {
  const [state, setState] = useContext(UserContext);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h1 className="dispay-1 text-center text-danger py-5">HomePage</h1>
          {JSON.stringify(state)}
          <img src="/images/default.jpg" />
        </div>
      </div>
    </div>
  );
};

export default Home;
