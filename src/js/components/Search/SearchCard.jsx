import React, { Fragment, useState, useEffect } from "react";
import Input from "../Form/Input/Input";
import Button from "../Button/Button";
import Options from "../Form/Options/Options";
import { required, length } from "../../util/validators";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import "./SearchCard.less";

export default props => {
  const SEARCH_FORM = {
    what: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })]
    },
    category: {
      value: "",
      valid: false,
      touched: false,
      validators: [required]
    },
    city: {
      value: "",
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })]
    }
  };
  const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: 345
    },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: red[500]
    }
  }));

  const [searchForm, setSearchForm] = useState(SEARCH_FORM);
  const [formIsValid, setFormIsValid] = useState(false);
  //const classes = useStyles();
  // const [expanded, setExpanded] = React.useState(false);

  function handleExpandClick() {
    setExpanded(!expanded);
  }
  useEffect(() => {
    //setSearchForm(SEARCH_FORM);
  }, []);

  const postInputChangeHandler = (input, value, files) => {
    setSearchForm(prevState => {
      let isValid = true;
      for (const validator of prevState[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...searchForm,
        [input]: {
          ...searchForm[input],
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
    setSearchForm(prevState => {
      return {
        ...prevState,
        [input]: {
          ...prevState[input],
          touched: true
        }
      };
    });
  };

  const acceptPostChangeHandler = () => {
    const post = {
      what: searchForm.what.value,
      city: searchForm.city.value
    };
    props.onFinishEdit(post);
    setSearchForm(SEARCH_FORM);
    setFormIsValid(false);
    setImagePreview(null);
  };

  return (
    <Fragment>
      <div className="text-guid">
        <p className='box-shadow-7'>Find Your Guid</p>
      </div>
      <form>
        <Input
          id="what"
          label="What"
          control="input"
          placeholder="What're you looking for?"
          onChange={postInputChangeHandler}
          onBlur={inputBlurHandler.bind(this, "what")}
          value={searchForm["what"].value}
          valid={searchForm["what"].valid}
          touched={searchForm["what"].touched}
        />
        <Options />
        <Input
          id="city"
          label="City"
          control="input"
          rows="5"
          placeholder="Paris"
          onChange={postInputChangeHandler}
          onBlur={inputBlurHandler.bind(this, "city")}
          valid={searchForm["city"].valid}
          touched={searchForm["city"].touched}
          value={searchForm["city"].value}
        />
        <Button mode="raised" design="accent">
          Search
        </Button>
      </form>
    </Fragment>
  );
};
