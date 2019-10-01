import React, { Fragment, useState, useEffect } from "react";
import Backdrop from "../../../components/Backdrop/Backdrop";
import Modal from "../../../components/Modal/Modal.jsx";
import Input from "../../../components/Form/Input/Input";
import FilePicker from "../../../components/Form/Input/FilePicker";
import Image from "../../../components/Image/Image.jsx";
import { required, length } from "../../../util/validators";
import { generateBase64FromImage } from "../../../util/image";
import Button from "../../../components/Button/Button";
import { newPostValid } from "../../../components/Form/Input/validation";

export default props => {
  const fields = [
    { label: "Title for your post", type: "input", name: "title", value: "" },
    {
      label: "Post content goes here!",
      type: "textarea",
      name: "content",
      value: ""
    },
    {
      label: "Add images",
      type: "file",
      name: "images",
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
  const [postForm, setPostForm] = useState([]);
  const [formIsValid, setFormIsValid] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [filesToBeSent, setFilesToBeSent] = useState([]);

  useEffect(() => {
    console.log("{formIsValid}", formIsValid);

    if (props.selectedPost) {
      const postForm = {
        title: {
          value: props.selectedPost.title,
          valid: true,
          touched: false,
          validators: [required, length({ min: 5 })]
        },
        images: {
          value: props.selectedPost.imageUrl,
          valid: true,
          touched: false,
          validators: [required]
        },
        content: {
          value: props.selectedPost.content,
          valid: true,
          touched: false,
          validators: [required, length({ min: 5 })]
        }
      };
      //setPostForm(postForm);
    }
  }, [props.editing]);

  const postInputChangeHandler = (postContent, files) => {
    if (files) {
      setFilesToBeSent(oldArray => [...oldArray, files[0]]);
      generateBase64FromImage(files[0])
        .then(b64 => {
          setImagePreview(oldImages => oldImages.concat(b64));
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

  const inputBlurHandler = input => {
    setPostForm(prevState => {
      return {
        ...prevState,
        [input]: {
          ...prevState[input],
          touched: true
        }
      };
    });
  };

  const cancelPostChangeHandler = () => {
    setPostForm(POST_FORM);
    setFormIsValid(false);
    props.onCancelEdit();
  };

  const acceptPostChangeHandler = formValue => {
    const post = {
      title: formValue.title,
      image: filesToBeSent,
      content: formValue.content
    };
    props.onFinishEdit(post);
    //setPostForm(POST_FORM);
    //setFormIsValid(false);
    //setImagePreview(null);
  };

  return props.editing ? (
    <Fragment>
      <div className="feed_edit">
        {props.title && <h1>{props.title}</h1>}
        <Input
          cancel
          value={postForm.title}
          control="form"
          fields={fields}
          validation={newPostValid}
          onChange={postInputChangeHandler}
          formSubmit={value => acceptPostChangeHandler(value)}
          btnValue="Create my post"
          cancelPostChangeHandler={cancelPostChangeHandler}
        >
          <div className="new-post__preview-image">
            {imagePreview &&
              imagePreview.map((images, index) => (
                <Image
                  onClick={() => handleRemoveImage(index)}
                  previews
                  key={index + "imagesPreview"}
                  className={"imageItem"}
                  imageUrl={images}
                  left
                />
              ))}
          </div>
        </Input>
      </div>
    </Fragment>
  ) : null;
};

{
  /* <Modal
        title="New Post"
        acceptEnabled={formIsValid}
        onCancelModal={cancelPostChangeHandler}
        onAcceptModal={acceptPostChangeHandler}
        isLoading={props.loading}
      > */
}

{
  /* <Input
            id="title"
            label="Title"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={inputBlurHandler.bind(this, "title")}
            value={postForm.title.value}
            valid={postForm.title.valid}
            touched={postForm.title.touched}
          /> */
}
{
  /* <Input
            id="content"
            label="Content"
            control="textarea"
            rows="5"
            onChange={postInputChangeHandler}
            onBlur={inputBlurHandler.bind(this, "content")}
            valid={postForm["content"].valid}
            touched={postForm["content"].touched}
            value={postForm["content"].value}
          /> */
}
{
  /* {!imagePreview.length && <p>Please choose some images.</p>} */
}
{
  /* <FilePicker
            id="image"
            label="Image"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={inputBlurHandler.bind(this, "image")}
            valid={postForm["image"].valid}
            touched={postForm["image"].touched}
          /> */
}
