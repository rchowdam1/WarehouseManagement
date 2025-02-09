import { Link } from "react-router-dom";
import classes from "./HomeNavigation.module.css";
function HomeNavigation() {
  //resume here 1/13 finish styling the home page to look like figma
  //navigation bar finished
  //start by implementing the 'welcome' elements
  return (
    <header className={classes.header}>
      <Link to="/" className={classes.appName}>
        <div>WareTrack</div>
      </Link>

      <nav className={classes.navigationBar}>
        <Link to="/login" className={classes.navigationItem}>
          LOG IN
        </Link>
        <Link to="/sign-up" className={classes.navigationItem}>
          SIGN UP
        </Link>
      </nav>
    </header>
  );
}

export default HomeNavigation;
