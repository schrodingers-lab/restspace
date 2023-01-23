import classNames from 'classnames';
import React from 'react';

const ToggleDateDisplay = ({ children, className, ...props }) => (
  <div {...props} className={classNames('max-w-xl', className)}>
    <div className="bg-white shadow-md rounded-b-xl dark:bg-black">{children}</div>
  </div>
);

export default ToggleDateDisplay;
