import HomeNavigation from "../components/Layout/HomeNavigation";
import classes from "./Home.module.css";
import Layout from "../components/Layout/Layout";

function Home() {
  return (
    <Layout>
      <div className="container">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div className={classes.welcomeElement}>
          <h2 style={{ paddingTop: "7%" }}>Welcome to WareTrack</h2>
        </div>

        <div className={classes.informationElement}>
          <div className={classes.addPadding}>
            <h3 style={{ fontSize: "27px" }}>
              The online Business Management Platform where you can
            </h3>
          </div>

          <div className={classes.optionsContainer}>
            <div className={classes.optionsElement}>
              <img
                src="/monitor.png"
                alt="monitor"
                width="50px"
                height="50px"
              />
              <div className="option-description">
                <p>Monitor and track inventory spaces</p>
              </div>
            </div>

            <div className={classes.optionsElement}>
              <img src="/chart.png" alt="chart" width="50px" height="50px" />
              <div className="option-description">
                <p>
                  Simulate inventory transactions that resemble real-time
                  business activity
                </p>
              </div>
            </div>

            <div className={classes.optionsElement}>
              <img src="/clock.png" alt="chart" width="50px" height="50px" />
              <div className="option-description">
                <p>Keep track of paid & unpaid orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
