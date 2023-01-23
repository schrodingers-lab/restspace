import React from 'react';
import Card from '../ui/Card';
import Categories from '../ui/Categories';
import CategoriesIcons from '../ui/CategoriesIcons';
import ToggleDateDisplay from '../ui/ToggleDatesDisplay';
import { displayCoverImage } from '../util/display';

export const IncidentCard = ({incident, key, onClickFnc}) => {
  const img0 = displayCoverImage(incident?.cover_image_url ); 

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
      <div className="px-4 py-4 bg-gray-100 rounded-b-xl dark:bg-gray-900">
       <h2 className="font-bold text-l text-gray-800 dark:text-gray-100">#{incident.id} - {incident.name}</h2>
        <div className='w-full pt-2'>
          <ToggleDateDisplay input_date={incident?.inserted_at} enableToggle={false} className="float-right" />
          <CategoriesIcons incident={incident} showAll={false} />
        </div>
      </div>
    </Card>
  );
}
  
export default IncidentCard;