import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const filePicker = props => (
  <div className="input file_picker">
    <input
      // onChange={e => props.onChange(props.id, e.target.value, e.target.files)}
      //onBlur={props.onBlur}
      type="file"
      id={props.id}
    />
    <label
      className={[
        // !props.valid ? "invalid" : "valid",
        // props.touched ? "touched" : "untouched",
        "btn-3"
      ].join(" ")}
      htmlFor={props.id}
    >
      <span>
        <i className="fas fa-plus"></i>
        Add {props.label}s
      </span>
    </label>
  </div>
);

export default filePicker;
