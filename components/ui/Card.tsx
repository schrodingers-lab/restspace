import classNames from 'classnames';
import React from 'react';

const Card = ({ children, className, ...props }) => (
  <div {...props} className={classNames('max-w-xl', className)} key={props.key ? props.key : 'card-key'}>
    <div className="bg-white shadow-md rounded-b-xl dark:bg-black">{children}</div>
  </div>
);

export default Card;
