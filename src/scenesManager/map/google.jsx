import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { getOrderId } from "../../redux/orderSlice";
import { useDispatch } from "react-redux";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const Map = () => {
// const {orderId} = useParams()
const [orderId,setOrderId] = useState(null) 
const dispatch = useDispatch()
const [coords, setCoords] = useState(null);
// useEffect(()=>{

// })

useEffect(()=>{
    dispatch(getOrderId({id:orderId}))
})

  const [center, setCenter] = useState({
    lat: 10.7949932,
    lng: 106.7192466,
  });
  const Position = ({ text }) => <div>{text}</div>;
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };

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
    const handleSelect = async () => {
      // const addressArr = orderId?.address.split(',')
      // const result = await geocodeByAddress( `${addressArr[addressArr.length - 2]},${addressArr[addressArr.length - 1]}`)
      // const result = await geocodeByAddress( order[0]?.address)
      // const latlng = await getLatLng( result[0])
      // setCoords(latlng)
      // console.log(result);
    
    };

    handleSelect();
    // getCurrentLocation();
  }, [orderId]); // Gọi hàm lấy vị trí hiện tại khi component được tạo // Gọi hàm lấy vị trí hiện tại khi component được tạo

  return (
    <div style={{  height: "100vh", width: "100%" }}>
      <GoogleMapReact
        center={center}
        defaultZoom={15}
        className="map-container" // Áp dụng lớp CSS cho bản đồ
      >
        <Position
          lat={59.955413}
          lng={30.337844}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
