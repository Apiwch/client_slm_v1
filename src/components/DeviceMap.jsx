import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Tooltip, TileLayer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
})

function SetViewOnClick({ coords }) {

  const map = useMap();

  useEffect(() => {
    // Check if the new coordinates are different from the current map view
    const [lat, lon] = coords;
    const currentView = map.getCenter();
    if (lat !== currentView.lat || lon !== currentView.lng) {
      // Set the new view only if the coordinates change
      map.setView(coords, 17);
    }
  }, [map, coords]);

  return null;
}

function DeviceMap({ messages, selectedDevice }) {
  const [location, setLocation] = useState([13.8208712, 100.5132449]);

  useEffect(() => {
    const filteredMessages = messages.filter(device => device.name === selectedDevice);

    if (filteredMessages.length > 0) {
      setLocation([filteredMessages[0].lat, filteredMessages[0].lon]);
    }
  }, [selectedDevice]);

  return (
    <MapContainer center={[13.8208712, 100.5132449]} zoom={8} scrollWheelZoom={false} >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {messages.map((message, index) => (

        <Marker position={[message.lat, message.lon]} key={index} >
          <Tooltip direction="top" offset={[-15, -10]} opacity={1} permanent >
            <dl >
              <dt>Name: {message.name}</dt>
              <dt>Sound Level: {message.value} dBA</dt>
              <dt>Status: {message.status}</dt>
            </dl>
          </Tooltip>
        </Marker>
      ))}
      <SetViewOnClick coords={location}></SetViewOnClick>
    </MapContainer>
  );
}

export default DeviceMap;
