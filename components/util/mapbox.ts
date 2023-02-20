import { createRoot } from "react-dom/client";

import MapInfo from "../map/MapInfo";
import * as mapboxgl from 'mapbox-gl'; 

export const mapboxglAccessToken = 'pk.eyJ1IjoiZGFycmVuLXByb3JvdXRlIiwiYSI6ImNsM2M2cjRhOTAxd3YzY3JvYjl1OXQ3Y3oifQ.lerkA3MPLmhRgla3jQnCGg';
export const mapboxglStyle = 'mapbox://styles/mapbox/streets-v11'

export const defaultInitialLat = -16.935682;
export const defaultInitialLng = 145.749049;
export const defaultInitialZoom = 11;

export const distanceMaxBase = 2.5;
export const distanceMaxIncident = 1.25;

export const localIncidentDistance = 10000;
export const ageInHours = 72;

export const metersToKm = (meters) => {
    if (meters == undefined || meters == null || meters < 1) return 1;
    const kms = meters / 1000;
    return Math.floor(kms);
}

export const addPopup = (el) => {
    const placeholder = document.createElement('div');
    let root =  createRoot(placeholder)
    root.render(el);
    const popup = new mapboxgl.Popup({ offset: 25, className: 'incidentPopup', closeButton: false, closeOnClick: true})
            .setDOMContent(placeholder)
    return popup
}

