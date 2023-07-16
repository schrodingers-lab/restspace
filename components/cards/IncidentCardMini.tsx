import React from 'react';
import Card from '../ui/Card';
import Categories from '../ui/Categories';
import CategoriesIcons from '../ui/CategoriesIcons';
import ToggleDateDisplay from '../ui/ToggleDatesDisplay';
import { displayCoverImage } from '../util/display';

export const IncidentCardMini = ({incident, onClickFnc},{key="incident-key-1"}) => {
 
  const internalOnClick = () => {
    if (onClickFnc){
      onClickFnc(incident);
    }
  }
  return (
    <Card className="my-2 mx-auto" key={key} onClick={internalOnClick}>
      <div className="px-4 py-4 bg-gray-100 rounded-xl dark:bg-black">
       <h2 className="font-bold text-l text-gray-800 dark:text-gray-100">#{incident.id} - {incident.name}</h2>
        <div className='w-full pt-2'>
          <ToggleDateDisplay input_date={incident?.inserted_at} enableToggle={false} className="float-right" />
          <CategoriesIcons incident={incident} showAll={false} />
        </div>
      </div>
    </Card>
  );
}
  
export default IncidentCardMini;