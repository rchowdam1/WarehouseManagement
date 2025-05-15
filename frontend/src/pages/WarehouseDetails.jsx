import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import AuthenticatedLayout from "../components/Layout/AuthenticatedLayout";

function WarehouseDetails() {
  const navigate = useNavigate();
  const { wid } = useParams(); // grab the warehouse id from the url

  const [items, setItems] = useState([]);
  const [warehouseName, setWarehouseName] = useState("");
  const [totalWarehouseValue, setTotalWarehouseValue] = useState(0);

  useEffect(() => {
    const fetchWarehouseDetails = async () => {
      const url = `http://localhost:5000/get_details/${wid}`;

      try {
        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          alert("Error fetching warehouse details");
          return;
        } else {
          const received = await response.json();
          if (received.message === "User not logged in") {
            alert("User not logged in");
            navigate("/login", { replace: true });
            return;
          } else if (received.message === "Warehouse not found") {
            alert("Warehouse not found");
            return;
          } else {
            // successfuly response
            console.log(received.items, received.name);
            setItems(received.items);
            setWarehouseName(received.name);
          }
        }
      } catch (error) {
        alert(error);
      }
    };

    fetchWarehouseDetails();
  }, []);

  useEffect(() => {
    let totalValue = 0;
    items.forEach((item) => {
      totalValue += Number(item.price) * Number(item.quantity);
    });
    setTotalWarehouseValue(totalValue);
    console.log(totalValue, "this is the total value");
  }, [items]);

  const generateColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // generate random color for each item
  const colors = items.map(() => generateColor());

  return (
    <AuthenticatedLayout>
      <div>
        <h1>{warehouseName ? warehouseName : "XXXXX"}</h1>
        <br />
        {/*Will be two UI components, left will be chart and right will be table*/}
        <div
          className="UI-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <div
            className="first-UI"
            style={{
              height: "500px",
              width: "450px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              boxShadow: "3px 3px 3px 3px  #888888",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontWeight: "700", fontSize: "24px" }}>
              Value of {warehouseName}
            </span>
            <span style={{ fontWeight: "700", fontSize: "24px" }}>
              ${totalWarehouseValue.toFixed(2)}
            </span>

            <div className="graph">
              <Doughnut
                data={{
                  labels: items.map((item) => item.name),
                  datasets: [
                    {
                      label: "Percentage",
                      data: items.map((item) => item.price * item.quantity),
                      backgroundColor: colors.map((color) => color),
                    },
                  ],
                }}
              />
            </div>
          </div>
          <div
            className="second-UI"
            style={{
              height: "500px",
              width: "450px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              boxShadow: "3px 3px 3px 3px #888888",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflowY: "scroll",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            <h2>Items</h2>
            <table
              style={{
                backgroundColor: "#ececec",
                width: "80%",
                padding: "15px",
                borderRadius: "5px",
              }}
            >
              <tr style={{ border: "1px solid black" }}>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
              {items.length > 0 ? (
                items?.map((item, key) => {
                  return (
                    <tr
                      key={key}
                      style={{
                        width: "100%",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      <td style={{ textAlign: "center", padding: "2px" }}>
                        {item.name}
                      </td>
                      <td style={{ textAlign: "center", padding: "2px" }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity > 0) {
                              setItems((prevItems) =>
                                prevItems.map((it, i) =>
                                  i === key
                                    ? { ...it, quantity: it.quantity - 1 }
                                    : it
                                )
                              );
                            }
                          }}
                          style={{
                            border: "2px",
                            borderRadius: "5px",
                            marginRight: "10px",
                            backgroundColor: "#ffb500",
                          }}
                        >
                          -
                        </button>
                        {item.quantity}
                        <button
                          type="button"
                          onClick={() => {
                            setItems((prevItems) =>
                              prevItems.map((it, i) =>
                                i === key
                                  ? { ...it, quantity: it.quantity + 1 }
                                  : it
                              )
                            );
                          }}
                          style={{
                            border: "2px",
                            borderRadius: "5px",
                            marginLeft: "10px",
                            backgroundColor: "#ffb500",
                          }}
                        >
                          +
                        </button>
                      </td>
                      <td style={{ textAlign: "center", padding: "20px" }}>
                        {item.price}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <h1>You currently have no items</h1>
              )}
            </table>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default WarehouseDetails;
