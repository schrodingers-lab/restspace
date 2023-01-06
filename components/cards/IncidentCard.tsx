import React from 'react';
import Card from '../ui/Card';

export const IncidentCard = ({incident, key, onClickFnc}) => {
  const img0 = incident?.cover_image_url ? incident?.cover_image_url : ''; //default img

  const internalOnClick = () => {
    if (onClickFnc){
      onClickFnc(incident);
    }
  }
  return (
    <Card className="my-4 mx-auto" key={key} onClick={internalOnClick}>
      <div className="h-32 w-full relative">
        <img className="h-32 px-auto w-full object-cover object-center" src={img0} alt="image" />
      </div>
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <h4 className="font-bold py-0 text-s text-gray-400 dark:text-gray-500 uppercase">{incident.about}</h4>
        <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">#{incident.id} - {incident.name}</h2>
        <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">{incident.road_surface}</p>
        <div className="flex items-center space-x-4">
          <h3 className="text-gray-500 dark:text-gray-200 m-l-8 text-sm font-medium">{incident.author}</h3>
        </div>
      </div>
    </Card>
  );
}
  
export default IncidentCard;