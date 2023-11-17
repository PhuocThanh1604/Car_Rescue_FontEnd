import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
mapboxgl.accessToken =
  "pk.eyJ1IjoidGhhbmgyazEiLCJhIjoiY2xvZjMxcWppMG5oejJqcnI2M2ZleTJtZiJ9.yvWTA-yYNqTdr2OstpB7bw";
  // mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const MapboxMap = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState({
    lat: 10.8591597,
    lng: 106.8095694,
  });
  const [loading, setLoading] = useState(false);
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 10.8591597,
    lng: 106.8095694,
  });
  const [defaultZoom, setDefaultZoom] = useState(11);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40], // Starting position [lng, lat]
      zoom: 11,
    });

    // Add a marker to the map
    // new mapboxgl.Marker().setLngLat([-74.5, 40]).addTo(map);

    setMap(map);
    return () => map.remove();
  }, []);

  // Function to update map center
  const updateMapCenter = (newCoords) => {
    map.flyTo({
      center: [newCoords.lng, newCoords.lat],
      essential: true,
    });
    setCoords(newCoords);
  };
  const handleAddressSelected = async (selectedAddress) => {
    let latLng; // Declare latLng in a broader scope
    try {
      const results = await geocodeByAddress(selectedAddress);
      if (results && results.length > 0) {
        const firstResult = results[0];
        const geoPlaceId = firstResult.place_id;
        latLng = await getLatLng(firstResult); // Assign value to latLng

        const selectedLocation = {
          lat: latLng.lat,
          lng: latLng.lng,
          address: firstResult.formatted_address,
          placeId: geoPlaceId,
        };

        setCoords({ lat: selectedLocation.lat, lng: selectedLocation.lng });
        setAddress(selectedLocation.address);

        const newCenter = {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        };
        const newZoom = 15; // Adjust the zoom level as needed

        setDefaultCenter(newCenter);
        setDefaultZoom(newZoom);
      } else {
        console.error("Không tìm thấy kết quả cho địa chỉ này.");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi trong quá trình tìm kiếm vị trí.", error);
    } finally {
      setLoading(false);
    }

    if (latLng) {
      updateMapCenter({ lat: latLng.lat, lng: latLng.lng });
      new mapboxgl.Marker().setLngLat([latLng.lng, latLng.lat]).addTo(map);
    }
  };

  const handleSearchIcon = async () => {
    handleAddressSelected(address);
  };
  const handleClearAddress = () => {
    setAddress("");
  };

  return (
    <div ref={mapContainer} style={{ height: "100%", width: "100%" }}>
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
              // Render your autocomplete UI here
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "10px",
                }}
              >
                <FormControl>
                  <TextField
                    {...getInputProps({
                      placeholder: "Nhập địa chỉ",
                      style: {
                        height: "50px",
                        width: "400px",
                        marginRight: "5px",
                        borderRadius: "10px",
                        backgroundColor: "white",
                      },
                    })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton type="submit" onClick={handleSearchIcon}>
                            <SearchIcon />
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
                    const style = suggestion.active
                      ? {
                          backgroundColor: "#41b6e6",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "400px",
                        }
                      : {
                          backgroundColor: "#fff",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "400px",
                        };

                    return (
                      <div {...getSuggestionItemProps(suggestion, { style })}>
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
      {/* <form
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
      </form> */}
    </div>
  );
};

export default MapboxMap;
