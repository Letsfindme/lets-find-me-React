import React from "react";

import "./Input.less";

const input = props => (
  <div className="wrapper">
    <div className="group">
      {props.control === "input" && (
        <input
          type="text"
          required="required"
          className={[
            !props.valid ? "invalid" : "valid",
            props.touched ? "touched" : "untouched"
          ].join(" ")}
          type={props.type}
          id={props.id}
          value={props.value}
          onChange={e =>
            props.onChange(props.id, e.target.value, e.target.files)
          }
          onBlur={props.onBlur}
        />
      )}
      {props.control === "textarea" && (
        <textarea
          className={[
            !props.valid ? "invalid" : "valid",
            props.touched ? "touched" : "untouched"
          ].join(" ")}
          id={props.id}
          rows={props.rows}
          required={props.required}
          value={props.value}
          onChange={e => props.onChange(props.id, e.target.value)}
          onBlur={props.onBlur}
        />
      )}
      <span className="highlight" />
      <span className="bar" />
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
    </div>
  </div>
  // <div>
  //   {props.label && <label htmlFor={props.id}>{props.label}</label>}
  //   {props.control === 'input' && (
  //       <input
  //       className={[
  //         'common-input',
  //         !props.valid ? 'invalid' : 'valid',
  //         props.touched ? 'touched' : 'untouched'
  //       ].join(' ')}
  //       type={props.type}
  //       id={props.id}
  //       required={props.required}
  //       value={props.value}
  //       placeholder={props.placeholder}
  //       onChange={e => props.onChange(props.id, e.target.value, e.target.files)}
  //       onBlur={props.onBlur}
  //       placeholder={props.placeholder}
  //     />
  //   )}
  //   {props.control === 'textarea' && (
  //     <textarea
  //       className={[
  //         !props.valid ? 'invalid' : 'valid',
  //         props.touched ? 'touched' : 'untouched'
  //       ].join(' ')}
  //       id={props.id}
  //       rows={props.rows}
  //       required={props.required}
  //       value={props.value}
  //       onChange={e => props.onChange(props.id, e.target.value)}
  //       onBlur={props.onBlur}
  //     />
  //   )}
  // </div>
);

export default input;
