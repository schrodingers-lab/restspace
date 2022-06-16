import * as React from 'react';


function MapInfo(props) {
  const { restArea, history } = props;
  const displayName = `${restArea?.id} - ${restArea?.name}`;

  const handleClick = (id) => {
    history.push(`/tabs/lists/${id}`);
  }

  return (
    <div onClick={(e) => handleClick(restArea?.id)}>
      <div>
        {displayName} 
      </div>
      <img width={240} src={restArea?.cover_image} />
    </div>
  );
}

export default React.memo(MapInfo);