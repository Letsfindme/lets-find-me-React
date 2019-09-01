import React from 'react';
import { Link } from 'react-router-dom';

const button = props =>
  !props.link ? (
    <button
      className={[
        'btn',
        `btn--${props.design}`,
        `btn--${props.mode}`
      ].join(' ')}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
      type={props.type}
    >
      {props.loading ? 'Loading...' : props.children}
    </button>
  ) : (
    <Link
      className={[
        'btn',
        `btn--${props.design}`,
        `btn--${props.mode}`
      ].join(' ')}
      to={props.link}
    >
      {props.children}
    </Link>
  );

export default button;
