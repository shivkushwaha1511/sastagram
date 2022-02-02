import UserRoute from "../../components/routes/UserRoute";

const Dashboard = () => {
  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h1 className="dispay-1 text-center text-danger py-5">Dashboard</h1>
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default Dashboard;
