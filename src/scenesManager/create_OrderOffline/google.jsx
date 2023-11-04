import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  geocodeByPlaceId,
} from "react-places-autocomplete";

const Map = ({ onLocationSelected }) => {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState([]);
  const Position = ({ text, icon }) => (
    <div>
      <FaMapMarkerAlt color="red" size={24} />
      {text}
    </div>
  );

  const defaultProps = {
    center: {
      lat: 10.8591597,
      lng: 106.8095694,
    },
    zoom: 11,
  };

  const handleAddressSelected = async (selectedAddress) => {
    try {
      // Sử dụng Places Autocomplete để lấy thông tin chi tiết về địa chỉ
      const results = await geocodeByAddress(selectedAddress);
      if (results && results.length > 0) {
        const firstResult = results[0];
        const latLng = await getLatLng(firstResult);
        const selectedLocation  = {
          lat: latLng.lat,
          lng: latLng.lng,
          address: firstResult.formatted_address,
        };
        setCoords({ lat: selectedLocation.lat, lng: selectedLocation.lng });
        setAddress(selectedLocation.address);
        setIsMapModalOpen(true);
        onLocationSelected(selectedLocation );
      } else {
        console.error("Không tìm thấy kết quả cho địa chỉ này.");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi trong quá trình tìm kiếm vị trí.", error);
    }
  };
  const handleSearch = async () => {
    try {
      const results = await geocodeByAddress(address);
      if (results && results.length > 0) {
        const firstResult = results[0];
        const latLng = await getLatLng(firstResult);
        const selectedAddress = {
          lat: latLng.lat,
          lng: latLng.lng,
          address: firstResult.formatted_address,
        };
        setCoords({ lat: selectedAddress.lat, lng: selectedAddress.lng });
        setIsMapModalOpen(true);
        onLocationSelected(selectedAddress);
      } else {
        console.error("Không tìm thấy kết quả cho địa chỉ này.");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi trong quá trình tìm kiếm vị trí.", error);
    }
  };
  // const handleSearch = async () => {
  //   try {
  //     const results = await geocodeByAddress(address);
  //     if (results && results.length > 0) {
  //       const firstResult = results[0];
  //       const latLng = await getLatLng(firstResult);
  //       setGeocodeResult(results);
  //       setCoords(latLng);
  //       setAddress()
  //       // Gọi hàm callback để truyền địa chỉ đã chọn
  //       handleAddressSelected(address);
  //     } else {
  //       console.error("Không tìm thấy kết quả cho địa chỉ này.");
  //     }
  //   } catch (error) {
  //     console.error("Đã xảy ra lỗi trong quá trình tìm kiếm vị trí.", error);
  //   }
  // };
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="search_address">
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleAddressSelected}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: "Nhập địa chỉ",
                  style: {
                    height: "50px",
                    width: "400px",
                    marginRight: "5px",
                    borderRadius: "10px",
                  },
                })}
              />
              <div>
                {suggestions.map((suggestion) => {
                  const style = {
                    backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                  };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        style,
                      })}
                    >
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <button
          style={{ height: "50px", borderRadius: "10px" }}
          onClick={handleSearch}
        >
          Tìm vị trí
        </button>
      </div>

      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCwBQ0eI1YsUlOC9nQ2ty1AZFzn4MZmr0o" }}
        defaultCenter={coords ?? defaultProps.center}
        defaultZoom={11}
        center={coords ?? defaultProps.center}
      >
        <Position lat={coords?.lat} lng={coords?.lng} />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
