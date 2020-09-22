import React, { Fragment, useEffect, useState } from "react";
import StoreItem from "../../components/Store/StoreItem/StoreItem";
import Button from "../../components/Button/Button";
import Back from "../../components/Button/Back";
import { useDispatch, useSelector } from "react-redux";
import { useFetch } from "../../util/api";
import { apiFetch } from "../../util/fetch";
import EditProduct from "./EditProduct";
import { date } from "yup";

export default (props) => {
  const url = `https://letsfindme.site/admin/product`;
  const shopUrl = `https://letsfindme.site/shop/products`;
  const options = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
  const delOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: {
      prodId: 0,
    },
  };
  const [admin, setAdmin] = useState("User");
  const [products, setProducts] = useState([]);
  const [basketId, setBasketId] = useState(null);
  // let basketId = "";
  const [basket, setBasket] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  // To rest new image preview after submit
  const [resetPreview, setRestPreview] = useState(false);
  const [total, setTotal] = useState(0);
  const userId = localStorage.getItem("userId");
  const rewards = localStorage.getItem("rewards-" + userId);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    let tempBasketId = "";
    userId ? (tempBasketId = "Basket-" + userId) : (tempBasketId = "Guest");
    userId ? setBasketId(tempBasketId) : setBasketId("Guest");
    localStorage.getItem(tempBasketId)
      ? //convert local storage to array
        setBasket(JSON.parse(localStorage.getItem(tempBasketId)))
      : // Initiat localStorage
        localStorage.setItem(tempBasketId, []);
    const getProducts = async () => {
      try {
        const { res, error, isLoading } = await apiFetch(shopUrl, options);

        isAddedToBasket(res, tempBasketId);
      } catch (error) {}
    };
    getProducts();
    localStorage.getItem("ref") == "Admin"
      ? setAdmin("Admin")
      : setAdmin("User");
  }, []);

  // Check if products are added to basket
  // if so add true to "added" then set products hook
  const isAddedToBasket = (res, tempBasketId) => {
    let newTotal = 0;
    let localBasket = localStorage.getItem(tempBasketId);
    try {
      localBasket ? (localBasket = JSON.parse(localBasket)) : "";
      if (localBasket) {
        for (let i = 0; i < res.length; i++) {
          localBasket.includes(res[i].id)
            ? ((res[i].added = true), (newTotal = newTotal + res[i].price))
            : (res[i].added = false);
        }
        setTotal(newTotal);
        setProducts(res);
      } else {
        setProducts(res);
      }
      let basketProd = res.filter((prod) => prod.added == true);
      localStorage.setItem(
        "Products-" + tempBasketId,
        JSON.stringify(basketProd)
      );
    } catch (error) {}
  };

  // Show products after hook are set
  useEffect(() => {
    if (products.length > 0) {
      setIsLoading(false);
    }
  }, [products]);

  // Save new product by admin
  const saveToBack = async (product, form) => {
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("image", product.image[0]);
    let optionsPost = options;
    optionsPost.method = "post";
    optionsPost.body = formData;
    try {
      if (!product.id) {
        const { res, error, isLoading } = await apiFetch(url, optionsPost);
        if (res.product) {
          let newProd = products.concat(res.product);
          setProducts(newProd);
          form.resetForm();
          // To toggle chiled image perview after subscribe
          setRestPreview(!resetPreview);
        }
      } else {
        optionsPost.method = "put";
        optionsPost.body.append("prodId", product.id);
        product.image[0]
          ? formData.append("image", product.image[0])
          : optionsPost.body.append("imageUrl", product.imageUrl);
        const { res, error, isLoading } = apiFetch(url, optionsPost);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeProductHandler = async (prodId) => {
    delOptions.body = JSON.stringify({
      prodId: prodId,
    });
    const { res, error, status } = await apiFetch(url, delOptions);
    if (status == 200) {
      setProducts(products.filter((product) => product.id != prodId));
    }
  };

  const goToEdit = () => {
    setEditing(!editing);
  };

  const addToBasket = (id) => {
    let newTotal = total;
    basket.includes(id) ? "" : setBasket((old) => [...old, id]);
    setProducts(
      products.map((item) =>
        item.id === id
          ? ((newTotal = newTotal + item.price), { ...item, added: true })
          : item
      )
    );
    setTotal(newTotal);
  };

  const removeFromBasket = (id) => {
    let newTotal = total;
    basket.includes(id)
      ? setBasket((old) => old.filter((singleId) => id != singleId))
      : "";
    setProducts(
      products.map((item) =>
        item.id === id
          ? ((newTotal = newTotal - item.price), { ...item, added: false })
          : item
      )
    );
    setTotal(newTotal);
  };

  //Add basket to localstorage
  useEffect(() => {
    if ((basket != null) & (basketId != null)) {
      localStorage.setItem(basketId, JSON.stringify(basket));
      let basketProd = products.filter((prod) => prod.added == true);
      localStorage.setItem("Products-" + basketId, JSON.stringify(basketProd));
    }
  }, [basket]);

  if (!products) {
    return <div>Loading...</div>;
  }
  //Show only on editing mode
  if (editing) {
    return (
      <div className={"wrapper-store"}>
        <div className={"navigation"}>
          <Back click={props.history.goBack} text=" back to home" />
          {admin && <Button onClick={() => goToEdit()}>Done editing</Button>}
        </div>
        {/* To add new product, allways dispayed */}
        <EditProduct
          key={"newProductKey"}
          onFinishEdit={(product, form) => saveToBack(product, form)}
          resetPreview={resetPreview}
        ></EditProduct>
        {/* To edit products , NOT allways dispayed */}
        {!isLoading
          ? products.map((product) => {
              return (
                <EditProduct
                  product={product}
                  key={product.id}
                  onFinishEdit={(product) => saveToBack(product)}
                  removeProductHandler={(productId) =>
                    removeProductHandler(productId)
                  }
                ></EditProduct>
              );
            })
          : ""}
      </div>
    );
  } else
    return (
      <div className={"wrapper-store"}>
        {/* Navigation section */}
        <div className={"wrapper-navigation"}>
          <div className={"navigation"}>
            <Back click={props.history.goBack} text=" back to home" />
            {rewards ? (
              <div className={"finalize"}>
                <p>
                  My rewards:
                  <strong> {rewards} +ME</strong>
                </p>
                <Button onClick={() => props.history.push("/store/basket")}>
                  <i className="fas fa-shopping-cart"></i> Basket
                  <div className="-popup">
                    Total:
                    {total} +ME
                    <br />
                    You added:
                    <ul>
                      {!isLoading &&
                        products.map((item) =>
                          item.added === true ? (
                            <li key={Math.random()}>- {item.title}</li>
                          ) : (
                            ""
                          )
                        )}
                    </ul>
                  </div>
                </Button>
              </div>
            ) : (
              <div className={"finalize"}>
                <i className="far fa-surprise"></i>
                <p className="-popup">
                  You don't have any rewards yet!! <br />
                  Post somthing or comment posts to get some rewards :)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Products section */}
        <div className="post-grid -product">
          {!isLoading &&
            products.map((item) => (
              <StoreItem
                added={item.added}
                id={item.id}
                title={item.title}
                price={item.price}
                imageUrl={item.imageUrl}
                description={item.description}
                key={item.id}
                onAdd={(id) => addToBasket(id)}
                onRemove={(id) => removeFromBasket(id)}
              ></StoreItem>
            ))}
        </div>
        {isAuthenticated && (
          <div className={"navigation -edit"}>
            {admin == "Admin" && (
              <Button onClick={() => goToEdit()}>Edit products</Button>
            )}
            <Button onClick={() => props.history.push("/store/orders")}>
              Purchase history
            </Button>
          </div>
        )}
      </div>
    );
};
