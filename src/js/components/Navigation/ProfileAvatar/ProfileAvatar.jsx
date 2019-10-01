import React from "react";
import { NavLink } from "react-router-dom";
import Image from "../../../components/Image/Image";

export default props => [
  props.isAuth && (
    <li
      key={"ndasf"}
      className={["avatar-container", props.className].join(" ")}
    >
      {props.avatar ? (
        <Image imageUrl={props.avatar} className="user-profile"/>
      ) : (
        <img className="user-profile" src={props.logo} />
      )}
      <div className="dropdown">
        <ul className="dropdown-ul">
          {props.subItems
            .filter(item => item.onAuth == true)
            .map(item => (
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
