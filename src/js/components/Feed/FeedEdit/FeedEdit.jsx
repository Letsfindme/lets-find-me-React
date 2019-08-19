import React, { Fragment, useState, useEffect } from "react";

import Backdrop from "../../Backdrop/Backdrop";
import Modal from "../../Modal/Modal.jsx";
import Input from "../../Form/Input/Input";
import FilePicker from "../../Form/Input/FilePicker";
import Image from "../../Image/Image.jsx";
import { required, length } from "../../../util/validators";
import { generateBase64FromImage } from "../../../util/image";

export default props => {
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
  const [postForm, setPostForm] = useState(POST_FORM);
  const [formIsValid, setFormIsValid] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [filesToBeSent, setFilesToBeSent] = useState([]);

  useEffect(() => {
    if (props.selectedPost) {
      console.log("props.selectedPost", props.selectedPost);

      const postForm = {
        title: {
          value: props.selectedPost.title,
          valid: true,
          touched: false,
          validators: [required, length({ min: 5 })]
        },
        image: {
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
      console.log("useeffect edit postForm", postForm);
      setPostForm(postForm);
      setFormIsValid(true);
    }
    
  }, [props.editing]);

  const postInputChangeHandler = (input, value, files) => {
    if (files) {
      setFilesToBeSent(oldArray => [...oldArray, files[0]]);
      generateBase64FromImage(files[0])
        .then(b64 => {
          console.log("setImagePreview");
          setImagePreview(b64);
        })
        .catch(e => {
          setImagePreview(null);
        });
    }
    setPostForm(prevState => {
      let isValid = true;
      for (const validator of prevState[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...postForm,
        [input]: {
          ...postForm[input],
          valid: isValid,
          value: files ? files[0] : value
        }
      };
      
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      setFormIsValid(formIsValid);
      return updatedForm;
    });
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

  const acceptPostChangeHandler = () => {
    const post = {
      title: postForm.title.value,
      image: filesToBeSent,
      content: postForm.content.value
    };
    props.onFinishEdit(post);
    setPostForm(POST_FORM);
    setFormIsValid(false);
    setImagePreview(null);
  };

  return props.editing ? (
    <Fragment>
      <Modal
        title="New Post"
        acceptEnabled={formIsValid}
        onCancelModal={cancelPostChangeHandler}
        onAcceptModal={acceptPostChangeHandler}
        isLoading={props.loading}
      >
        <form>
          <Input
            id="title"
            label="Title"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={inputBlurHandler.bind(this, "title")}
            value={postForm.title.value}
            valid={postForm.title.valid}
            touched={postForm.title.touched}
          />
          <FilePicker
            id="image"
            label="Image"
            control="input"
            onChange={postInputChangeHandler}
            onBlur={inputBlurHandler.bind(this, "image")}
            valid={postForm["image"].valid}
            touched={postForm["image"].touched}
          />
          <div className="new-post__preview-image">
            {!imagePreview && <p>Please choose an image.</p>}
            {imagePreview && <Image imageUrl={imagePreview} contain left />}
          </div>
          <Input
            id="content"
            label="Content"
            control="textarea"
            rows="5"
            onChange={postInputChangeHandler}
            onBlur={inputBlurHandler.bind(this, "content")}
            valid={postForm["content"].valid}
            touched={postForm["content"].touched}
            value={postForm["content"].value}
          />
        </form>
      </Modal>
    </Fragment>
  ) : null;
};
