import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./Image.css";

export default props =>
    props.previews ? (
        props.local ?
            <div
                className={props.className}
                style={{
                    backgroundImage: `url('${props.imageUrl}')`,
                    backgroundSize: props.contain ? "contain" : "cover",
                    backgroundPosition: props.backgroundPosition
                        ? props.backgroundPosition
                        : "center"
                }}
            >
            </div>
            : props.imageUrl.length > 1 ? (
                <div
                    className={props.className}
                    style={{
                        backgroundImage: `url('${props.imageUrl}')`,
                        backgroundSize: props.contain ? "contain" : "cover",
                        backgroundPosition: props.backgroundPosition
                            ? props.backgroundPosition
                            : "center"
                    }}
                >
        <span onClick={props.onClick}>
          <FontAwesomeIcon icon="trash-alt"/>
        </span>
                </div>
            ) : (
                ""
            )


    ) : props.imageUrl ? (
        <div className="bg-avatar-contaiver">
            <div
                className={props.className ? props.className : "image"}
                style={{
                    backgroundImage: `url('${"http://letsfindme.site/" +
                    props.imageUrl.replace("\\", "/")}')`,
                    backgroundSize: props.contain ? "contain" : "cover",
                    backgroundPosition: props.backgroundPosition
                        ? props.backgroundPosition
                        : "center"
                }}
            />
        </div>
    ) : (
        ""
    );
