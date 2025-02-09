import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import AuthenticatedLayout from "../components/Layout/AuthenticatedLayout";
import classes from "./Landing.module.css";

function Landing() {
  const navigate = useNavigate();
  const location = useLocation();

  const [modalOpen, setModalOpen] = useState(false);
  const [loadedUsername, setLoadedUsername] = useState("");

  useEffect(() => {
    const retrieve = async () => {
      try {
        const url = `http://localhost:5000/select_user/${location.state.userID}`;

        const response = await fetch(url);

        if (!response.ok) {
          alert(response);
        } else {
          const received = await response.json();
          setLoadedUsername(received.username);
        }
      } catch (error) {
        alert(error);
      }
    };

    retrieve();
  }, []);

  const openModal = () => {
    setModalOpen(!modalOpen);
  };

  const logOut = () => {
    navigate("/", { replace: true });
  };

  const switchUser = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <AuthenticatedLayout />
      <br />

      <div className="sign-out-component">
        <div className={classes.signOutContainer}>
          <button className={classes.signOutButton} onClick={openModal}>
            <img src="user.png" width="35px" height="35px" alt="profile" />
          </button>
          <h3 className={classes.loadedUsername}>{loadedUsername}</h3>
        </div>

        {modalOpen && (
          <div className={classes.modal}>
            <div className={classes.triangle}></div>

            <div className={classes.body}>
              <span className={classes.switchOption} onClick={switchUser}>
                Switch User
                <img
                  src="add-user.png"
                  height="21px"
                  width="21px"
                  style={{ float: "right" }}
                />
              </span>
              <hr />
              <span className={classes.logOutOption} onClick={logOut}>
                Log Out
                <img
                  src="logout.png"
                  height="21px"
                  width="21px"
                  style={{ float: "right" }}
                />
              </span>
            </div>
          </div>
        )}
      </div>

      <br />
      <br />

      <h1 style={{ fontSize: "40px", textAlign: "center" }}>
        Welcome back, {loadedUsername}
      </h1>
      <h2 style={{ fontSize: "28px", textAlign: "center" }}>Warehouses</h2>
    </div>
  );
}

export default Landing;
