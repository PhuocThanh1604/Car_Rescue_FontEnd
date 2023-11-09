import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import TextField from "@mui/material/TextField";
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { FaMapMarkerAlt } from "react-icons/fa";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const Map = () => {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 10.8591597,
    lng: 106.8095694,
  });
  const [defaultZoom, setDefaultZoom] = useState(11);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [isCustomAddress, setIsCustomAddress] = useState(false);
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
        // setIsMapModalOpen(true);
        // onLocationSelected(selectedLocation );

        const newCenter = {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        };
        const newZoom = 15; // You can adjust the zoom level as needed

        setDefaultCenter(newCenter);
        setDefaultZoom(newZoom);
      } else {
        console.error("Không tìm thấy kết quả cho địa chỉ này.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Đã xảy ra lỗi trong quá trình tìm kiếm vị trí.", error);
      setLoading(false);
    }
  };
  const handleSearchIcon = async () => {
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
        // onLocationSelected(selectedAddress);

        const newCenter = {
          lat: selectedAddress.lat,
          lng: selectedAddress.lng,
        };
        const newZoom = 15; // You can adjust the zoom level as needed

        setDefaultCenter(newCenter);
        setDefaultZoom(newZoom);
      } else {
        console.error("Không tìm thấy kết quả cho địa chỉ này.");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi trong quá trình tìm kiếm vị trí.", error);
    }
  };
  const Position = ({ lat, lng, text, icon }) => {
    if (lat && lng) {
      // Render the marker only if valid coordinates are available
      return (
        <div>
          <FaMapMarkerAlt color="red" size={24} />
          {text}
        </div>
      );
    } else {
      return null; // Don't render the marker if coordinates are not available
    }
  };
  const handleClearAddress = () => {
    setAddress("");
  };
  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
 
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyBSLmhb6vCHhrZxMh3lmUI-CICfzhiMakk",
        }}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        center={coords ?? defaultCenter}
        zoom={defaultZoom}
      >
        <Position lat={coords?.lat} lng={coords?.lng} />
      </GoogleMapReact>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchIcon();
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          p={2}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          zIndex="1"

        >
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleAddressSelected}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div style={{ display: "flex", flexDirection: "column",  borderRadius: "10px", }}>
                <FormControl>
                  <TextField
                    {...getInputProps({
                      placeholder: "Nhập địa chỉ",
                      style: {
                        height: "50px",
                        width: "400px",
                        marginRight: "5px",
                        borderRadius: "10px",
                        backgroundColor:"white"
                      },
                    })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                           
                          <IconButton
                            type="submit"
                            onClick={handleSearchIcon}
                          >
                           <SearchIcon/>
                          </IconButton>
                          <IconButton onClick={handleClearAddress}>
                            {loading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <CloseIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                <div>
                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "400px",
                    };

                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          style,
                        })}
                      >
                           <FaMapMarkerAlt style={{ marginRight: "5px" }} />
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </Box>
      </form>
    </div>
  );
};

export default Map;
