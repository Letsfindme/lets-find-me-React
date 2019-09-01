import React from "react";

import "./Options.less";

const input = props => (
  <div className="select">
    <select className="select-text" required>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </select>
    <span className="select-highlight" />
    <span className="select-bar" />
    <label className="select-label">Select</label>
  </div>
);

export default input;
