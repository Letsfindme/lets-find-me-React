import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/Form/Input/Input";
import Button from "../../components/Button/Button.jsx";
import { required, length, email } from "../../util/validators";
import { loginValid } from "../../components/Form/Input/validation";
import { generateBase64FromImage } from "../../util/image";
import Image from "../../components/Image/Image.jsx";

export default props => {
  const dispatch = useDispatch();
  const avatar = [{ label: "images", type: "file", name: "images", value: "" }];
  let fields = [
    { label: "Firstname", type: "input", name: "firstname", value: "" },
    { label: "Lastname", type: "input", name: "lastname", value: "" },
    { label: "Email", type: "input", name: "email", value: "" },
    { label: "Password", type: "input", name: "password", value: "" }
  ];

  const addressFields = [
    { label: "Street", type: "input", name: "street", value: "" },
    { label: "City", type: "input", name: "city", value: "" },
    { label: "Country", type: "input", name: "country", value: "" },
    { label: "Post code", type: "input", name: "postcode", value: "" }
  ];

  const getToken = useSelector(state => state.auth.token);
  const [imagePreview, setImagePreview] = useState([]);
  const [imageDefault, setImageDefault] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [lodaingProfile, setLodaingProfile] = useState(false);
  const [loadedFields, setLoadedFields] = useState(fields);
  const [loadedAddress, setLoadedAddress] = useState(fields);

  useEffect(() => {
    if (getToken) {
      fetch("http://localhost:8080/user/profile", {
        headers: {
          Authorization: "Bearer " + getToken
        }
      })
        .then(res => {
          if (res.status !== 200) {
            throw new Error("Failed to fetch user Profile.");
          }
          return res.json();
        })
        .then(resData => {
          setUserProfile(resData);
          appendUserDate(resData.user);
        });
    }
  }, [getToken]);

  const appendUserDate = data => {
    setLodaingProfile(true);
    if (data.firstname) {
      fields[0].value = data.firstname;
      fields[1].value = data.lastname;
      fields[2].value = data.email;

      addressFields[0].value = data.address.street;
      addressFields[1].value = data.address.city;
      addressFields[2].value = data.address.country;
      addressFields[3].value = data.address.postcode;

      setImageDefault(data.Avatar.imageRef);
      setLoadedFields(fields);
      setLoadedAddress(addressFields);
    } else {
    }

    setLodaingProfile(false);
  };

  const acceptPostChangeHandler = files => {
    const formData = new FormData();
    formData.append("image", files.images[0]);
    let url = "http://localhost:8080/user/profile/avatar";
    let method = "POST";
    fetch(url, {
      method: method,
      body: formData,
      headers: {
        Authorization: "Bearer " + getToken
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating or editing a post failed!");
        }
        return res.json();
      })
      .then(res => {
        dispatch({ type: "UPDATE_AVATAR", payload: res.imageRef });
      });
  };

  const adressInfoHandler = address => {
    let url = "http://localhost:8080/user/profile/address/";
    let method = "POST";
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken
      },
      body: JSON.stringify({
        street: address.street,
        city: address.city,
        country: address.country,
        postcode: address.postcode
      })
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Creating or editing a post failed!");
      }
      return res.json();
    });
  };

  const profileInfoHandler = profile => {
    let url = "http://localhost:8080/user/profile/";
    let method = "POST";
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken
      },
      body: JSON.stringify({
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email
      })
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Creating or editing a post failed!");
      }
      return res.json();
    });
  };

  const avatarHandler = (postContent, files) => {
    if (files) {
      generateBase64FromImage(files[0])
        .then(b64 => {
          setImagePreview(b64);
        })
        .catch(e => {
          setImagePreview(oldImages => [...oldImages]);
        });
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  return (
    <div className="profile-wrapper">
      <div className="login-card">
        <h2>My avatar!</h2>
        <Input
          control="form"
          btnValue="Update my avatar"
          fields={avatar}
          onChange={avatarHandler}
          //   validation={loginValid}
          formSubmit={value => acceptPostChangeHandler(value)}
        >
          <div className="new-post__preview-image">
            {imagePreview.length > 1 ? (
              <Image
                onClick={handleRemoveImage}
                previews
                key={"imagesPreview avatar"}
                className={"imageItem"}
                imageUrl={imagePreview}
                left
              />
            ) : (
                <Image
                  onClick={handleRemoveImage}
                  key={"imagesPreview avatar"}
                  className={"user-profile"}
                  imageUrl={imageDefault}
                  left
                />
              )}
          </div>
        </Input>
      </div>
      <div className="login-card">
        <h2>Profile info!</h2>
        {!lodaingProfile ? (
          <Input
            control="form"
            btnValue="Update Personal Info"
            fields={loadedFields}
            //   validation={loginValid}
            formSubmit={e => profileInfoHandler(e)}
          />
        ) : (
            ""
          )}
      </div>
      <div className="login-card">
        <h2>My Address</h2>
        {!lodaingProfile ? (
          <Input
            control="form"
            btnValue="Update My Address"
            fields={loadedAddress}
            //   validation={loginValid}
            formSubmit={e => adressInfoHandler(e)}
          />
        ) : (
            ""
          )}
      </div>
    </div>
  );
};
