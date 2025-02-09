import classes from "./Navigation.module.css";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <header className={classes.header}>
      <div className={classes.appName}>WareTrack</div>

      <nav className={classes.navigationBar}>
        <Link to="/overview" className={classes.navigationItem}>
          Overview
        </Link>

        <Link to="/orders" className={classes.navigationItem}>
          Orders
        </Link>

        <Link to="/simulate" className={classes.navigationItem}>
          Simulate
        </Link>
      </nav>
    </header>
  );
}

export default Navigation;
