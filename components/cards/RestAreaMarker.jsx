import Card from '../ui/Card';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';


export const RestAreaMarker = (restarea, key) => {
  return (
    <Card className="my-4 mx-auto" key={key}>
      <div className="h-32 w-full relative">
        <img className="h-32 px-auto w-full object-cover object-center" src={restarea?.cover_image} alt="image" />
      </div>
      <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{restarea.name}</h2>
      </div>
      <button>More Info</button>
    </Card>
  );
}
  
export default RestAreaMarker;