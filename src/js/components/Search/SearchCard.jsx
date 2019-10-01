import React, { Fragment, useState, useEffect } from "react";
import Input from "../Form/Input/Input";
import Button from "../Button/Button";
import Options from "../Form/Options/Options";
import { required, length } from "../../util/validators";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import { Formik } from "formik";
import {searchValid} from '../Form/Input/validation';

export default props => {
  const fields = [
    {label: 'What are you looking for?', type: 'input', name: 'what', value: ''},
    {label: 'In which city', type: 'input', name: 'city', value: ''}, 
    {label: 'Category', type: 'select', data: ['Restaurant', 'Hotel', 'House', 'Villages'], name: 'category', value: 'Please Select'},
    
  ];
  const SEARCH_FORM = {
    what: {
      value: "",
      valid: false,
      touched: false,
      validators: []
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

  const options = ["Restaurant", "Hotel", "Home"];

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
        <h1 className="box-shadow-7">Find Your Guid</h1>
      </div>
      <Input control="form" 
      btnValue="Search"
      fields={fields} validation={searchValid} />
     
    {/*   <form>
        <Input
          id="what"
          type="email"
          placeholder="restaurant"
          label="What're you looking for?"
          control="input"
          onChange={postInputChangeHandler}
          onBlur={inputBlurHandler.bind(this, "what")}
          value={searchForm["what"].value}
          valid={searchForm["what"].valid}
          touched={searchForm["what"].touched}
        />
        <Options options={options} />
        <Input
          id="city"
          placeholder="Paris"
          label="I'm looking in?"
          control="input"
          rows="5"
          onChange={postInputChangeHandler}
          onBlur={inputBlurHandler.bind(this, "city")}
          valid={searchForm["city"].valid}
          touched={searchForm["city"].touched}
          value={searchForm["city"].value}
        />
        <Button mode="raised" design="accent">
          Search
        </Button>
      </form> */}
    </Fragment>
  );
};
