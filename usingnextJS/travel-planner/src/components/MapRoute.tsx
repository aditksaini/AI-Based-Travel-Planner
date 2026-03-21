"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Next.js/Webpack
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

function BoundsFitter({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  return null;
}

export default function MapRoute({ sourceData, mapData, routeInfo }: { sourceData: any; mapData: any; routeInfo: any }) {
  const sourcePos: [number, number] | null = sourceData ? [sourceData.point.lat, sourceData.point.lng] : null;
  const destPos: [number, number] | null = mapData ? [mapData.point.lat, mapData.point.lng] : null;

  // Graphhopper points are [lng, lat], Leaflet needs [lat, lng]
  const polylineCoords: [number, number][] = routeInfo?.points?.coordinates
    ? routeInfo.points.coordinates.map((coord: [number, number]) => [coord[1], coord[0]])
    : [];

  const bounds: L.LatLng[] = [];
  if (sourcePos) bounds.push(L.latLng(sourcePos[0], sourcePos[1]));
  if (destPos) bounds.push(L.latLng(destPos[0], destPos[1]));
  
  // Create a default center if we only have one point
  const center = sourcePos || destPos || [0, 0];

  return (
    <MapContainer 
      center={bounds.length > 0 ? undefined : center} 
      zoom={13} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      {sourcePos && (
        <Marker position={sourcePos}>
          <Popup>Origin: {sourceData.name}</Popup>
        </Marker>
      )}

      {destPos && (
        <Marker position={destPos}>
          <Popup>Destination: {mapData.name}</Popup>
        </Marker>
      )}

      {polylineCoords.length > 0 && (
        <Polyline positions={polylineCoords} color="#00f5ff" weight={5} opacity={0.8} />
      )}

      {bounds.length > 1 && <BoundsFitter bounds={bounds as unknown as L.LatLngBoundsExpression} />}
    </MapContainer>
  );
}
