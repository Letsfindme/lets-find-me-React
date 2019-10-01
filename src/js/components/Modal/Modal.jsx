import React from "react";
import ReactDOM from "react-dom";

import Button from "../Button/Button.jsx";

const modal = props =>
  ReactDOM.createPortal(
    <div className={["modal", props.mobile ? "modal-mobile" : ""].join(' ')}>
      {!props.noHeader ? (
        <header className="modal__header">
          <h1>
            {props.title} {props.acceptEnabled}
          </h1>
        </header>
      ) : (
        ""
      )}

      <div className="modal__content">{props.children}</div>
      {!props.noAction ? (
        <div className="modal__actions">
          <Button design="danger" mode="flat" onClick={props.onCancelModal}>
            Cancel
          </Button>
          <Button
            mode="raised"
            onClick={props.onAcceptModal}
            disabled={!props.acceptEnabled}
            loading={props.isLoading}
          >
            Ouiiii
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>,
    document.getElementById("modal-root")
  );

export default modal;
