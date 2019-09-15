import React from "react";
import { NavLink } from "react-router-dom";

export default props => [
  props.isAuth && (
    // onMouseEnter={props.handleHover}
    <li key={"ndasf"} className={["avatar-container",props.className].join(' ')}>
      <img className="user-profile" src={props.avatar} />
      {/* {props.showAboutMenu && ( */}
        {/* //  onMouseLeave={props.handleLeave} */}
        <div className="dropdown" >
          <ul className="dropdown-ul">
            {props.subItems.map(item => (
              <li
                className="current"
                key={item.id}
                onClick={() => props.onChoose(item)}
                className={[" ", item.className].join(" ")}
              >
                <NavLink to={item.link} exact>
                  {item.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      {/* )} */}
    </li>
  )
];
