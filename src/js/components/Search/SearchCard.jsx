import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../Form/Input/Input";
import { searchValid } from "../Form/Input/validation";

export default props => {
  const { category, city, term } = useSelector(state => state.search.searchVal);
  const [loading, setLoading] = useState(true);
  let fields = [
    {
      label: "What are you looking for?",
      type: "input",
      name: "term",
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

  useEffect(() => {
    setLoading(true);
    term != undefined ? (fields[0].value = term) : "";
    city != undefined ? (fields[1].value = city) : "";
    category != undefined ? (fields[2].value = category) : "";
    setLoadedFields(fields);
  }, [category, city, term]);

  useEffect(() => {
    setLoading(false);
  }, [loadedFields]);

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
