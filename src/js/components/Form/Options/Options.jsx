import React from "react";

const input = props => (
  <div className="select group">
    <select className="select-text" required>
      {props.options.map(option => <option key={option} value="1">{option}</option>)}
    </select>
    <span className="select-highlight" />
    <span className="select-bar" />
    <label className="select-label">Select</label>
  </div>
);

export default input;
