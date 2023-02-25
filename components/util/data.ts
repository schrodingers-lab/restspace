import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
import MapInfo from '../map/MapInfo';
import { displayLevelColor } from './display';
import { addPopup } from './mapbox';

export const generateRandomName = () => {
  const snameDictionary = [
    'Queen',
    "Victoria",
    "John",
    "Elizabeth",
    "King",
    "Church",
    "William",
    "George"
  ]
  const streetDictionary = [
    'Road',
    'Street',
    'Drive',
    'Avenue',
    'Boulevard',
    'Lane',
    'Parkway',
    'Square',
    'Way',
    'Court',
    'Place',
    'Circle',
    'Highway',
    'Trail',
    'Park',
    'Commons',
    'Terrace',
    'Grove',
    'Gardens',
  ];

    const customConfig: Config = {
        dictionaries: [snameDictionary, streetDictionary],
        separator: ' ',
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

export const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const from = page ? page * limit : 0
  const to = page ? from + size - 1 : size - 1

  return { from, to }
}