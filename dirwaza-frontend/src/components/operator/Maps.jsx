"use client";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapEvents({ onMapClick, flyPosition }) {
  const map = useMap();

  useEffect(() => {
    if (onMapClick) {
      const handleClick = (e) => {
        onMapClick(e.latlng);
      };
      
      map.on('click', handleClick);
      
      return () => {
        map.off('click', handleClick);
      };
    }
  }, [map, onMapClick]);

  useEffect(() => {
    if (flyPosition?.lat && flyPosition?.lng) {
      map.flyTo([flyPosition.lat, flyPosition.lng], 13, {
        duration: 1.5,
      });
    }
  }, [map, flyPosition]);
  
  return null;
}

export default function Maps({
  position,
  onPositionChange,
  address,
  onAddressChange,
  onMapClick,
}) {
  const mapRef = useRef(null);

  return (
    <div className="flex-1 !h-full !w-full" ref={mapRef}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={10}
        scrollWheelZoom={true}
        className="!h-full !w-full min-w-40 min-h-40 rounded-[0.75rem]"
        zoomAnimation={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {position?.lat && (
          <MapEvents
            flyPosition={position}
            onMapClick={onMapClick}
          />
        )}
        {position && (
          <Marker position={[position.lat, position.lng]} icon={icon} />
        )}
      </MapContainer>
    </div>
  );
} 