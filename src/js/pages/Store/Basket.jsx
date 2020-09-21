import React, { Fragment, useEffect, useState } from "react";
import StoreItem from "../../components/Store/StoreItem/StoreItem";
import Back from "../../components/Button/Back";
import Button from "../../components/Button/Button";
import { apiFetch } from "../../util/fetch";

export default (props) => {
  const url = `http://localhost:8080/shop/cart`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: {
      productId: [],
    },
  };
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [basketId, setBasketId] = useState(null);
  const [basket, setBasket] = useState([]);
  const [warning, setWarning] = useState(false);
  let userId = localStorage.getItem("userId");
  const rewards = localStorage.getItem("rewards-" + userId);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("Products-Basket-" + userId)));
  }, []);

  const removeFromBasket = (id) => {
    setProducts(products.filter((prod) => prod.id != id));
  };

  //Add basket to localstorage after setting products
  useEffect(() => {
    let newTotal = 0;
    if (products != null) {
      let prodIds = [];
      // Count total cost
      let basketProd = products.filter((prod) => prod.added == true);
      basketProd.map((prod) => {
        (newTotal = prod.price + newTotal), prodIds.push(prod.id);
      });
      setTotal(newTotal);
      //Save basket in the backend
      options.body = JSON.stringify({
        productId: prodIds,
      });
      const saveBasket = async () => {
        await apiFetch(url, options);
      };
      saveBasket();
      //Save product in local storage
      localStorage.setItem(
        "Products-Basket-" + userId,
        JSON.stringify(basketProd)
      );
      //Update ids for store page
      localStorage.setItem("Basket-" + userId, JSON.stringify(prodIds));
    }
  }, [products]);

  const checkBuyProducts = () => {
    rewards > total ? buyProducts() : doWarning();
  };
  const buyProducts = async () => {
    options.body = JSON.stringify({
      productId: localStorage.getItem("Basket-" + userId),
    });
    const { res, error, isLoading } = await apiFetch(url + "/order", options);
    if (res) {
      //Save product in local storage
      localStorage.setItem("Products-Basket-" + userId, []);
      //Update ids for store page
      localStorage.setItem("Basket-" + userId, []);
      setBasketId([]);
      props.history.push("/store/orders");
    }
  };

  const doWarning = () => {
    setWarning(true);
    const timer = setTimeout(() => {
      setWarning(false);
    }, 3000);
    return () => clearTimeout(timer);
  };

  if (!products) {
    return <div>Loading...</div>;
  }

  return (
    <div className={"wrapper-store"}>
      <div className={"navigation"}>
        <Back click={props.history.goBack} text="Back to store" />
        <p>
          You have:
          <strong> {rewards} +ME</strong>
        </p>
        <div className={"finalize"}>
          <p>
            Total:
            <strong> {total} +ME</strong>
          </p>
          <Button onClick={checkBuyProducts}>Buy</Button>
        </div>
      </div>
      {warning ? (
        <div className="post-grid -product -red">
          {" "}
          <p>You don't have enugh credit</p>{" "}
        </div>
      ) : (
        ""
      )}
      <div className="post-grid -product">
        {products.map((item) => (
          <StoreItem
            added={item.added}
            id={item.id}
            title={item.title}
            price={item.price}
            imageUrl={item.imageUrl}
            description={item.description}
            key={item.id}
            onRemove={(id) => removeFromBasket(id)}
          ></StoreItem>
        ))}
      </div>
    </div>
  );
};
