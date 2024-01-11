import ChartContainer from "../Components/Chart";
import OlenasGrid from "../Components/OlenasGrid";


const Dashboard = () => {
  return (
    <div className="card-container grid main-content" id="Dashboard">
      <div className="greeting">Hello again, Olena!</div>
      <div className="card-component">
        {" "}
        <ChartContainer />
      </div>

      <div className="card-component">
        {" "}
        <OlenasGrid />
      </div>
    </div>
  );
};
export default Dashboard;
