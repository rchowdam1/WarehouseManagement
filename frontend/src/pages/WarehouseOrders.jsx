import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import AuthenticatedLayout from "../components/Layout/AuthenticatedLayout";

function Order({ sequenceNumber, orderTotal, orderNumber, originWarehouse }) {
  return (
    <div
      className="order-container"
      style={{
        height: "110px",
        width: "170px",
        borderRadius: "10px",
        backgroundColor: "#3a0063",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "7px",
        flexShrink: 0,
      }}
    >
      <span>
        Order {sequenceNumber}: {originWarehouse}
      </span>
      <span style={{ fontWeight: "650" }}>${orderTotal.toFixed(2)}</span>
      <span>#{orderNumber}</span>
    </div>
  );
}

function WarehouseOrders() {
  const navigate = useNavigate();

  const [userID, setUserID] = useState();
  const [warehouses, setWarehouses] = useState([]);

  const [selectedWarehouseID, setSelectedWarehouseID] = useState("");
  const [selectedWarehouseItems, setSelectedWarehouseItems] = useState([]);
  const [selectedWarehouseName, setSelectedWarehouseName] = useState(""); // to pass the name to the Order component

  // shopping cart
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0.0);

  // the orders that have been placed
  const [orders, setOrders] = useState([]); // an array of objects of the order prices and warehouse name

  useEffect(() => {
    // first call server to get the userID
    const getUserID = async () => {
      const url = "http://localhost:5000/current_user";

      try {
        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          alert("User not logged in, redirecting to login");
          navigate("/login", { replace: true });
          return;
        } else {
          const received = await response.json();
          if (received.message === "User is logged in") {
            setUserID(received.user_id);
          } else {
            // this should not happen
            alert("User not logged in, redirecting to login");
            navigate("/login", { replace: true });
            return;
          }
        }
      } catch (error) {
        alert(error);
      }
    };

    getUserID();
  }, []);

  useEffect(() => {
    if (!userID) return;
    // second call to get the warehouses associated with the userID
    const getWarehouses = async () => {
      const url = `http://localhost:5000/get_warehouses/${userID}`;
      try {
        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          alert("Error fetching warehouses - line 58");
          return;
        } else {
          const received = await response.json();
          if (received.message === "User not logged in") {
            alert("User not logged in, redirecting to login");
            navigate("/login", { replace: true });
            return;
          } else if (received.message === "No warehouses for the user") {
            // do nothing
          } else if (received.message === "Warehouses found") {
            //console.log(received.warehouses, "fetched these warehouses");
            setWarehouses(received.warehouses);

            // set the first warehouse as the selected warehouse
            if (received.warehouses.length > 0) {
              setSelectedWarehouseID(received.warehouses[0].id);
            }
          }
        }
      } catch (error) {
        alert(error);
      }
    };

    getWarehouses();
  }, [userID]);

  // side effect to get the items of the selected warehouse
  useEffect(() => {
    if (!selectedWarehouseID) return;
    setCart([]);
    const getSelectedWarehouseItems = async () => {
      const url = `http://localhost:5000/get_details/${selectedWarehouseID}`;

      try {
        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          alert("Error fetching warehouse items - line 96");
        } else {
          const received = await response.json();
          if (received.message === "User not logged in") {
            alert("User not logged in, redirecting to login");
            navigate("/login", { replace: true });
            return;
          } else if (received.message === "Warehouse not found") {
            // do nothing
            return;
          } else if (received.message === "Items found") {
            /*console.log(
              received.items,
              `these are the items from ${received.name}`
            );*/
            setSelectedWarehouseItems(received.items);
            return;
          }
        }
      } catch (error) {
        alert(error);
      }
    };

    const getSelectedWarehouseName = async () => {
      const url = `http://localhost:5000/get_warehouse_name/${selectedWarehouseID}`;

      try {
        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          alert("Request failed - line 170");
        } else {
          const received = await response.json();
          if (received.message === "Found warehouse") {
            setSelectedWarehouseName(received.name);
          } else {
            alert("Nothing happened - 176");
          }
        }
      } catch (error) {
        alert("Catch block - 180");
      }
    };

    getSelectedWarehouseItems();
    getSelectedWarehouseName();
  }, [selectedWarehouseID]);

  useEffect(() => {
    // this will be used to calculate the total of the cart
    //console.log(cart, "this is the current cart");
    // recalculate the cart total

    //if (!cartTotal) return;
    //console.log("executing");
    if (cart.length === 0) {
      // if no items in the cart then set to 0
      setCartTotal(0.0);
      return;
    }

    // if it reaches here then the cart length is greater than 0
    let currentTotal = 0.0;
    cart.forEach((item) => {
      currentTotal += item.price * item.quantity;
    });
    //console.log(currentTotal);
    setCartTotal(currentTotal);
  }, [cart]);

  const placeOrder = () => {
    // get the cart total and place and order
    // the order will be a UI component displayed in
    // the recent orders section
    setOrders((prevOrders) => {
      return [...prevOrders, { cartTotal, selectedWarehouseName }];
    });
    // reset the cart
    // the useEffect that triggers off of cart changes will update the cartTotal to 0.0
    setCart([]);
  };

  useEffect(() => {
    if (orders.length === 0) return;

    generateRevenues();
  }, [orders]);

  const generateColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // the total revenue generated by each warehouse through orders
  const generateRevenues = () => {
    // key: warehouseName, value: revenue of the warehouse
    let warehouseRevs = {};

    orders.forEach((order) => {
      if (warehouseRevs[order.selectedWarehouseName]) {
        warehouseRevs[order.selectedWarehouseName] += order.cartTotal;
      } else {
        warehouseRevs[order.selectedWarehouseName] = order.cartTotal;
      }
    });

    console.log(warehouseRevs, "revenues for each warehouse");

    return warehouseRevs;
  };

  return (
    <AuthenticatedLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          paddingTop: "50px",
        }}
      >
        <span
          style={{ fontWeight: "700", fontSize: "36px", textAlign: "center" }}
        >
          Recent Orders
        </span>
        {/*Horizontal flexbox container of the line graph and order placing*/}
        <div
          className="content-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItem: "center",
            gap: "20px",
          }}
        >
          {/*Line graph of the historical orders*/}
          <div
            className="first-UI"
            style={{
              width: "650px",
              height: "500px",
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "3px 3px 3px 3px  #888888",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <span>Order History</span>
            {orders.length > 0 && (
              <Bar
                data={{
                  labels: Object.keys(
                    generateRevenues()
                  ) /*[...new Set(orders.map((order) => order.selectedWarehouseName))]*/,
                  datasets: [
                    {
                      label: "Revenue ($$)",
                      data: Object.values(generateRevenues()),
                      backgroundColor: Object.keys(generateRevenues()).map(
                        (_) => generateColor()
                      ),
                      borderRadius: 10,
                    },
                  ],
                }}
              />
            )}
          </div>

          <div className="right-hand-side">
            {/*Recent Orders right hand side*/}
            <div
              className="recent-orders"
              style={{
                width: "500px",
                height: "130px",
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "2px 2px 2px 2px  #888888",
                marginBottom: "20px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                overflowX: "auto",
                gap: "10px",
                flexWrap: "nowrap",
              }}
            >
              {orders.length === 0 ? (
                <span style={{ fontWeight: "550", fontSize: "21px" }}>
                  Recent Orders
                </span>
              ) : (
                // map each of the orders to an Order component
                orders.map((order, key) => {
                  return (
                    <Order
                      key={key}
                      sequenceNumber={key + 1}
                      orderTotal={order.cartTotal}
                      orderNumber={"123456789"}
                      originWarehouse={order.selectedWarehouseName}
                    />
                  );
                })
              )}
            </div>
            {/*Order placing right hand side*/}
            <div
              className="second-UI"
              style={{
                width: "500px",
                height: "350px",
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "2px 2px 2px 2px  #888888",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                overflowY: "scroll",
              }}
            >
              <div className="order-placing">
                <span>Select a warehouse to place an order</span>
              </div>
              <select
                name="warehouse"
                style={{
                  width: "75px",
                  height: "30px",
                  textAlign: "center",
                  borderRadius: "8px",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
                onChange={(e) => {
                  setSelectedWarehouseID(e.target.value);
                }}
              >
                {warehouses.length > 0 ? (
                  warehouses.map((warehouse, key) => {
                    return (
                      <option key={key} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    );
                  })
                ) : (
                  <option value="">No Warehouses Available</option>
                )}
              </select>

              {/*Order summary and Available Items*/}
              <div
                className="order-summary-and-items"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "40px",
                  paddingLeft: "5px",
                }}
              >
                {/*Order Summary*/}
                <div className="order-summary" style={{ textAlign: "center" }}>
                  <span style={{ fontWeight: "650" }}>Order Summary</span>
                  {/*items of the order*/}
                  <div
                    className="order-items"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "3px",
                    }}
                  >
                    {/*<div style={{ fontSize: "14px" }}>
                      <span>Item 1 </span>
                      <span>4.99 x 2</span>
                      <span> = 9.98</span>
                    </div>

                    <div style={{ fontSize: "14px" }}>
                      <span>Item 2</span>
                    </div>

                    <div style={{ fontSize: "14px" }}>
                      <span>Item 3</span>
                    </div>*/}
                    {cart.length > 0 ? (
                      cart.map((item, key) => {
                        console.log(
                          item,
                          "if this executes then that means that cart.length > 0"
                        );
                        return (
                          <div key={key} style={{ fontSize: "11px" }}>
                            <span>{item.name} </span>
                            <span>
                              {item.price} x {item.quantity}
                            </span>
                            <span>
                              = ${Number(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div>Cart is empty</div>
                    )}
                  </div>
                  <span style={{ fontWeight: "650" }}>
                    Total: ${cartTotal.toFixed(2)}
                  </span>
                  <br />
                  {cartTotal > 0 && (
                    <button
                      type="button"
                      style={{
                        borderRadius: "10px",
                        border: "none",
                        backgroundColor: "#ffb500",
                        padding: "8px",
                        fontWeight: "550",
                        fontSize: "13px",
                        color: "white",
                      }}
                      onClick={placeOrder}
                    >
                      Confirm
                    </button>
                  )}
                </div>

                {/*Available Items Table*/}
                <div className="available-items">
                  <table>
                    <tr>
                      <th style={{ fontSize: "14px" }}>Item Name</th>
                      <th style={{ fontSize: "14px" }}>Quantity</th>
                      <th style={{ fontSize: "14px" }}>Price</th>
                    </tr>
                    {selectedWarehouseItems.length > 0 ? (
                      selectedWarehouseItems.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td
                              style={{ fontSize: "14px", textAlign: "center" }}
                            >
                              {item.name}
                            </td>
                            <td
                              style={{ fontSize: "14px", textAlign: "center" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "10px",
                                  minWidth: "100px", // optional fixed space for consistency
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    // taking an item from the warehouse and adding it to the cart
                                    // check if the item is available
                                    if (item.quantity > 0) {
                                      setSelectedWarehouseItems((prevItems) =>
                                        prevItems.map((it, i) =>
                                          i === key
                                            ? {
                                                ...it,
                                                quantity: it.quantity - 1,
                                              }
                                            : it
                                        )
                                      );

                                      // add to cart
                                      setCart((prevCart) => {
                                        const existingItem = prevCart.find(
                                          (currItem) =>
                                            currItem.name === item.name
                                        );

                                        if (existingItem) {
                                          return prevCart.map((currItem) => {
                                            if (currItem.name === item.name) {
                                              return {
                                                ...currItem,
                                                quantity: currItem.quantity + 1,
                                              };
                                            } else {
                                              return currItem;
                                            }
                                          });
                                        } else {
                                          return [
                                            ...prevCart,
                                            {
                                              name: item.name,
                                              quantity: 1,
                                              price: item.price,
                                            },
                                          ];
                                        }
                                      });
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
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "24px",
                                    textAlign: "center",
                                  }}
                                >
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedWarehouseItems((prevItems) =>
                                      prevItems.map((it, i) =>
                                        i === key
                                          ? { ...it, quantity: it.quantity + 1 }
                                          : it
                                      )
                                    );

                                    // remove from cart if it is there
                                    setCart((prevCart) => {
                                      const existingItem = prevCart.find(
                                        (currItem) =>
                                          currItem.name === item.name
                                      );
                                      if (!existingItem) return prevCart;

                                      if (existingItem.quantity === 1) {
                                        // if current quantity is one, remove it from the cart
                                        return prevCart.filter(
                                          (eachItem) =>
                                            eachItem.name !== item.name
                                        );
                                      } else {
                                        return prevCart.map((currItem) => {
                                          return currItem.name === item.name
                                            ? {
                                                ...currItem,
                                                quantity: currItem.quantity - 1,
                                              }
                                            : currItem;
                                        });
                                      }
                                    });
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
                              </div>
                            </td>
                            <td
                              style={{ fontSize: "14px", textAlign: "center" }}
                            >
                              {item.price}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ textAlign: "center" }}>
                          No Items available
                        </td>
                      </tr>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default WarehouseOrders;
