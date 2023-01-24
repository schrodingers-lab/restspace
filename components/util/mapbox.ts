export const mapboxglAccessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';
export const mapboxglStyle = 'mapbox://styles/mapbox/streets-v11'

export const defaultInitialLat = -16.935682;
export const defaultInitialLng = 145.749049;
export const defaultInitialZoom = 11;

export const distanceMaxBase = 2.5;
export const distanceMaxIncident = 1.25;

export const metersToKm = (meters) => {
    if (meters == undefined || meters == null || meters < 1) return 1;
    const kms = meters / 1000;
    return Math.floor(kms);
}

