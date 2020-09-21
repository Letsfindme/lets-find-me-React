import React, { Fragment, useEffect, useState } from "react";
import Input from "../../components/Form/Input/Input";
import { required, length } from "../../util/validators";
import { useFetch } from "../../util/api";
import { newProductValid } from "../../components/Form/Input/validation";
import Image from "../../components/Image/Image.jsx";
import { generateBase64FromImage } from "../../util/image";

export default props => {
  const fields = [
    {
      label: "Add image",
      type: "file",
      name: "images",
      value: ""
    },
    { label: "Price of the product", type: "input", name: "price", value: "" },
    { label: "Title of the product", type: "input", name: "title", value: "" },
    {
      label: "Product description goes here!",
      type: "textarea",
      name: "description",
      value: ""
    }
  ];
  const POST_FORM = {
    title: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })]
    },
    image: {
      value: "",
      valid: false,
      touched: false,
      validators: [required]
    },
    content: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })]
    }
  };
  const [productForm, setProductForm] = useState([]);
  const [formIsValid, setFormIsValid] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageDefault, setImageDefault] = useState("");
  const [filesToBeSent, setFilesToBeSent] = useState([]);
  const [loadedFields, setLoadedFields] = useState(fields);
  const [loading, setLoading] = useState(true);
  const [buttonValue, setButtonValue] = useState("Add new Product");
  const [delBtnValue, setDelBtnValue] = useState("Empty fields");

  useEffect(() => {
    if (props.product) {
      appendProductDate(props.product);
      setButtonValue("Update Product");
      setDelBtnValue("Delete Product");
    } else {
      setLoading(false);
    }
  }, []);

  const appendProductDate = product => {
    if (product) {
      setLoading(true);
      let newFields = fields;
      let { title, price, imageUrl, description } = product;
      newFields[1].value = price;
      newFields[2].value = title;
      newFields[3].value = description;
      setImageDefault(imageUrl);
      setLoadedFields(newFields);
      setLoading(false);
    }
  };

  const productInputChangeHandler = (productContent, files) => {
    if (files) {
      setFilesToBeSent([files[0]]);
      generateBase64FromImage(files[0])
        .then(b64 => {
          setImagePreview(b64);
        })
        .catch(e => {
          setImagePreview(oldImages => [...oldImages]);
        });
    }
  };

  const handleRemoveImage = index => {
    const newFilesToBeSent = [...filesToBeSent];
    const newArray = [...imagePreview];
    newFilesToBeSent.splice(index, 1);
    newArray.splice(index, 1);
    setImagePreview(newArray);
    setFilesToBeSent(newFilesToBeSent);
  };

  const removeProductHandler = form => {
    props.product
      ? props.removeProductHandler(props.product.id)
      : form.resetForm();
    setImagePreview(null);
  };
  useEffect(() => {
    setLoading(false);
  }, [fields]);

  // To toggle image perview after subscribe
  useEffect(() => {
    setImagePreview(null);
  }, [props.resetPreview]);

  const productChangeHandler = (formValue, form) => {
    let product = {
      title: formValue.title,
      price: formValue.price,
      image: filesToBeSent,
      description: formValue.description
    };
    if (props.product) {
      product.id = props.product.id;
      product.imageUrl = props.product.imageUrl;
    }
    props.onFinishEdit(product, form);
  };

  return (
    <div>
      <Fragment>
        <div className="feed-container feed-edit">
          {props.children}
          {props.title && <h1>{props.title}</h1>}
          <div className="new-post__preview-image -product">
            {imagePreview && imagePreview.length > 0 ? (
              <Image
                onClick={handleRemoveImage}
                previews
                key={"imagesPreview avatar"}
                className={"imageItem -product"}
                imageUrl={imagePreview}
                left
              />
            ) : (
              <Image
                onClick={handleRemoveImage}
                key={"imagesPreview avatar"}
                className={"imageItem -product"}
                imageUrl={imageDefault}
                left
              />
            )}
          </div>
          {!loading && (
            <Input
              cancel
              value={productForm.title}
              control="form"
              fields={loadedFields}
              validation={newProductValid}
              onChange={(productContent, files) =>
                productInputChangeHandler(productContent, files)
              }
              formSubmit={(value, form) => productChangeHandler(value, form)}
              cancelPostChangeHandler={removeProductHandler}
              btnValue={buttonValue}
              cancelBtn={delBtnValue}
            ></Input>
          )}
        </div>
      </Fragment>
    </div>
  );
};
