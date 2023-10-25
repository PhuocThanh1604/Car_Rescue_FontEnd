import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './maker';

const Map = () => {
  const [center, setCenter] = useState({
    lat:10.7949932,
    lng: 106.7192466,
  });

  // Hàm để lấy vị trí hiện tại của người dùng
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(userLocation);
      });
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []); // Gọi hàm lấy vị trí hiện tại khi component được tạo

  return (
    <div style={{marginLeft:"10px", height: '100%', width: '100%' }}>
      <GoogleMapReact
        center={center} // Sử dụng center mới lấy được
        defaultZoom={15}
      >
 
      </GoogleMapReact>
    </div>
  );
};

export default Map;
