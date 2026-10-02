// Projection for /public/map/casablanca.svg, a stylized render of OpenStreetMap data
// (coastline + motorway/trunk/primary/secondary roads) for this bounding box.
const BBOX = { north: 33.64, west: -7.74 };
const COS_LAT = 0.833259132944705;
const SCALE = 8728.049876904102;

export const MAP_WIDTH = 1600;
export const MAP_HEIGHT = 1309;

/** Position of a coordinate on the map, as fractions (0–1) of its width and height. */
export function project(lat: number, lng: number) {
  return {
    x: ((lng - BBOX.west) * COS_LAT * SCALE) / MAP_WIDTH,
    y: ((BBOX.north - lat) * SCALE) / MAP_HEIGHT,
  };
}

export const districts = [
  { name: "Océan Atlantique", lat: 33.625, lng: -7.7, ocean: true },
  { name: "Aïn Diab", lat: 33.585, lng: -7.69 },
  { name: "Anfa", lat: 33.583, lng: -7.652 },
  { name: "Maârif", lat: 33.572, lng: -7.632 },
  { name: "Médina", lat: 33.601, lng: -7.618 },
  { name: "Port", lat: 33.612, lng: -7.604 },
  { name: "Hay Hassani", lat: 33.556, lng: -7.678 },
  { name: "Aïn Sebaâ", lat: 33.604, lng: -7.54 },
];
