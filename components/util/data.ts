import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
import MapInfo from '../map/MapInfo';
import { displayLevelColor } from './display';
import { addPopup } from './mapbox';

export const generateRandomName = () => {
    const customConfig: Config = {
        dictionaries: [adjectives, colors],
        separator: '-',
        length: 2,
      };

      return uniqueNamesGenerator(customConfig)
}


export const arrayToMap = (array: any[], key: string) => {
  return array.reduce((map, obj) => {
      map.set(obj[key], obj);
      return map;
  }, new Map());
}

export const addToNewMap = (existingMap: Map<string, any>, additionKey: string, additionValue: any) => {
  const newMap = new Map(existingMap);
  newMap.set(additionKey, additionValue);
  return newMap;
}

export const convertIncidentToGeoJson = ( incident) => {
  
  // const mapIncident = incidents[0];

  // const m_popup = addPopup(<MapInfo incident={mapIncident} history={history} />)
  // const markerColor = displayLevelColor(mapIncident);
  // const marker = new mapboxgl.Marker({color: markerColor})
  //   .setLngLat([mapIncident.longitude, mapIncident.latitude])
  //   .setPopup(m_popup)
  //   .addTo(map.current);
  // newMarkers.push(marker);


  return (
    {
      "type": "Feature",
      "properties": {
        "markerColor": displayLevelColor(incident),
        "incidentRef": incident.id
      },
      "geometry": {
        "type": "Point",
        "coordinates": [incident.longitude, incident.latitude]
      }
    }
    )
}