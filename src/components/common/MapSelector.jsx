import React, { useEffect, useRef } from 'react';

const MapSelector = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // This function will be called when the component unmounts
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (window.L && mapRef.current && !mapInstance.current) {
      mapInstance.current = window.L.map(mapRef.current).setView([51.505, -0.09], 2);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);

      mapInstance.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        
        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
        } else {
          markerRef.current = window.L.marker(e.latlng).addTo(mapInstance.current);
        }
        
        onLocationSelect({ lat, lng });
      });
    }

    const timer = setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    }, 100);

    return () => clearTimeout(timer);

  }, [onLocationSelect]);

  return <div ref={mapRef} style={{ height: '300px', width: '100%' }} />;
};

export default MapSelector;
