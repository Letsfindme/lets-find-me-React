import React, { useEffect, useState } from "react";
import StoreItem from "../../components/Store/StoreItem/StoreItem";
import Back from "../../components/Button/Back";
import { apiFetch } from "../../util/fetch";
import Moment from "react-moment";

export default (props) => {
  const url = `https://letsfindme.site/shop/cart/orders`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const [orders, setOrders] = useState([]);
  const [rewards, setRewards] = useState(
    localStorage.getItem("rewards-" + userId)
  );
  let userId = localStorage.getItem("userId");
  // let rewards = localStorage.getItem("rewards-" + userId);

  useEffect(() => {
    const getOrders = async () => {
      const { res } = await apiFetch(url, options);
      setOrders(res.orders);
      setRewards(res.credit);
      localStorage.setItem("rewards-" + userId, res.credit);
    };
    getOrders();
  }, []);

  const goToStore = () => {
    props.history.push("/store");
  };

  if (orders.length === 0) {
    return (
      <div>
        <p>No Order yet? comme back later!</p>
      </div>
    );
  }

  return (
    <div className={"wrapper-store"}>
      <div className={"navigation"}>
        <Back click={goToStore} text="Back to store" />
        <p>
          You have:
          <strong> {rewards} +ME</strong>
        </p>
      </div>
      <div className="post-grid -product -orders">
        <h1>Orders history:</h1>
        {orders.map((order) => (
          <div key={order.id}>
            <h2>
              <hr />
              Order date: <span> </span>
              <Moment format="YYYY/MM/DD hh:mm">{order.createdAt}</Moment>
            </h2>
            <div className="order-grid">
              {order.products.map((item) => (
                <StoreItem
                  added={item.added}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  imageUrl={item.imageUrl}
                  description={item.description}
                  key={item.id}
                  //to remove add button
                  order={true}
                  added={true}
                ></StoreItem>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
