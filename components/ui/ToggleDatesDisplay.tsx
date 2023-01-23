import classNames from 'classnames';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import React, { useState } from 'react';

const ToggleDateDisplay = ({ input_date, addSufix=true, enableToggle=true, className='', ...props  }) => {
  const [displayMode, setDisplayMode] = useState<'distance'|'raw'>('distance');

  const handleClickRaw = (event) => {
    if (enableToggle){
      event.preventDefault();
      setDisplayMode('distance')
    }
  }

  const handleClickDistance = (event) => {
    if (enableToggle){
      event.preventDefault();
      setDisplayMode('raw')
    }
  }

  return (
    <div {...props} className={classNames('', className)}>
      { displayMode == 'raw' && 
        <div className="" onClick={handleClickRaw}>
          {input_date}
        </div>
      }
         { displayMode == 'distance' && 
        <div className=""  onClick={handleClickDistance}>
          {formatDistanceToNow(new Date(input_date),{addSuffix: addSufix})}
        </div>
      }
    </div>

  )
};

export default ToggleDateDisplay;
