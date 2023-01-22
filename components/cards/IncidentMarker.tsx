import React from 'react';
import Card from '../ui/Card';

export const IncidentMarker = (incident, key) => {
  return (
    <Card className="my-4 mx-auto" key={key}>
      <div className="h-32 w-full relative">
        <img className="h-32 px-auto w-full object-cover object-center" src={incident?.cover_image_url} alt="image" />
      </div>
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{incident.name}</h2>
      </div>
      <button>More Info</button>
    </Card>
  );
}
  
export default IncidentMarker;