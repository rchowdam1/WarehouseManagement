import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import AuthenticatedLayout from "../components/Layout/AuthenticatedLayout";
import Warehouses from "../components/Warehouses";
import AddWarehouses from "../components/AddWarehouses";
import ClearAll from "../components/ClearAll";
import LeftHandButton from "../components/LeftHandButton";
import classes from "./Landing.module.css";

function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userID, setUserID] = useState();

  const [modalOpen, setModalOpen] = useState(false);
  const [loadedUsername, setLoadedUsername] = useState("");
  const [userWarehouses, setUserWarehouses] = useState([]);

  // Modals resulting from clicking Left Hand Buttons
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  // opening warehouse modal

  useEffect(() => {
    const retrieve = async () => {
      try {
        /*
         * Get the userID of the logged in user
         */
        const idUrl = "http://localhost:5000/current_user";

        let loggedInID = undefined;

        const idResponse = await fetch(idUrl, {
          credentials: "include",
        });

        if (!idResponse.ok) {
          alert(idResponse, "redirecting to login");
          navigate("/login", { replace: true });
          return;
        } else {
          const idReceived = await idResponse.json();
          if (idReceived.message === "User is logged in") {
            // user is logged in to set the userID
            loggedInID = idReceived.user_id;
            console.log(
              idReceived.user_id,
              "this is the user id fetched from the server"
            );
            setUserID(idReceived.user_id);
          } else {
            alert("User is not logged in");
            navigate("/login", { replace: true });
            return;
          }
        }

        if (loggedInID === undefined) {
          alert("Couldn't set the userID, redirecting to login");
          navigate("/login", { replace: true });
          return;
        }

        const url = `http://localhost:5000/select_user/${loggedInID}`;

        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          alert(response);
        } else {
          const received = await response.json();
          console.log(received.warehouses, "these are the user's warehouses");
          setLoadedUsername(received.username);
          setUserWarehouses(received.warehouses);
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

  const logOut = async () => {
    const url = "http://localhost:5000/logout";

    try {
      const response = await fetch(url, {
        credentials: "include",
      });
      if (!response.ok) {
        alert(response, "error logging out");
        return;
      } else {
        const received = await response.json();
        console.log(response.status);
        if (received.message === "User logged out") {
          console.log("User logged out");
        } else {
          alert("Problem occurred while trying to log out");
          return;
        }
      }
    } catch (error) {
      alert(error, "error logging out");
      return;
    }
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

      <h1
        style={{
          fontSize: "40px",
          textAlign: "center",
          position: "relative",
          left: "75px",
        }}
      >
        Welcome back, {loadedUsername}
      </h1>
      <h2
        style={{
          fontSize: "28px",
          textAlign: "center",
          position: "relative",
          left: "75px",
        }}
      >
        Warehouses
      </h2>

      <div
        className="content-container"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <LeftHandButton
          styling={{ position: "relative", left: "75px" }}
          addWarehouseModalStatus={createModalOpen}
          clearWarehouseModalStatus={clearModalOpen}
          userID={userID}
          onAddWarehouseClick={() => {
            setCreateModalOpen(true);
          }}
          onClearWarehouseClick={() => {
            setClearModalOpen(true);
          }}
          closeAddWarehouseModal={() => {
            setCreateModalOpen(false);
          }}
          closeClearWarehouseModal={() => {
            setClearModalOpen(false);
          }}
        />
        <Warehouses loadedWarehouses={userWarehouses} />
      </div>

      <br />
      <br />
    </div>
  );
}

export default Landing;
