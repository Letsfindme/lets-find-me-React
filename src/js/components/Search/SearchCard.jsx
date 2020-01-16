import React, { Fragment, useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import Input from "../Form/Input/Input";
import Button from "../Button/Button";
import Options from "../Form/Options/Options";
import { required, length } from "../../util/validators";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import { Formik } from "formik";
import { searchValid } from "../Form/Input/validation";

export default props => {
  const [loading, setLoading] = useState(true);
  let fields = [
    {
      label: "What are you looking for?",
      type: "input",
      name: "what",
      value: ""
    },
    { label: "In which city", type: "input", name: "city", value: "" },
    {
      label: "Category",
      type: "select",
      data: ["Restaurant", "Hotel", "House", "Villages"],
      name: "category",
      value: "Please Select"
    }
  ];
  const [loadedFields, setLoadedFields] = useState(fields);

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  useEffect(() => {
    setLoading(true);
    if (props.searchVlaues) {
      const { category, city, term } = props.searchVlaues;
      term != undefined ? (fields[0].value = term) : "";
      city != undefined ? (fields[1].value = city) : "";
      category != undefined ? (fields[2].value = category) : "";
      setLoadedFields(fields);
    } else {
      setLoading(false);
    }
  }, [props.searchVlaues]);

  useEffect(() => {
    setLoading(false);
  }, [loadedFields]);

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

  return (
    <Fragment>
      <div className="text-guid">
        <h1 className="box-shadow-7">Find Your Guid</h1>
      </div>
      {!loading && (
        <Input
          control="form"
          btnValue="Search"
          fields={loadedFields}
          validation={searchValid}
          formSubmit={value => props.acceptSearchChangeHandler(value)}
        />
      )}
    </Fragment>
  );
};
