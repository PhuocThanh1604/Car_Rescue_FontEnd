import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import TextField from "@mui/material/TextField";
import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { FaMapMarkerAlt } from "react-icons/fa";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { tokens } from "../../../theme";
import { useSpring, animated } from "react-spring";
const Map = ({ technicianLocation, infoTechnician, loadingMap }) => {
  const avatarAnimation = useSpring({
    from: { transform: "scale(1.2)" }, 
    to: async (next) => {
      while (true) {
        await next({ transform: "scale(1.2)" }); 
        await next({ transform: "scale(1)" }); 
      }
    },
    config: { duration: 400, reset: true }, 
  });
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [defaultZoom, setDefaultZoom] = useState(15);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 10.7983303,
    lng: 106.6428588,
  });
  useEffect(() => {
    if (!technicianLocation || !infoTechnician) {
      // Set default coordinates if technicianLocation is not available
      setCoords({ lat: defaultCenter.lat, lng: defaultCenter.lng });
      setData(null);
      setLoading(false);
      setDefaultZoom(defaultZoom);
    } else {
      setCoords(technicianLocation);
      setData(infoTechnician);
      setLoading(loadingMap);
      setDefaultZoom(17);
    }
  }, [technicianLocation, infoTechnician, loadingMap]);
  const handleAddressSelected = async (selectedAddress) => {
    try {
      // Sử dụng Places Autocomplete để lấy thông tin chi tiết về địa chỉ
      const results = await geocodeByAddress(selectedAddress);
      if (results && results.length > 0) {
        const firstResult = results[0];
        const latLng = await getLatLng(firstResult);
        const selectedLocation = {
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
        const newZoom = 15;

        setCoords(newCenter);
        setDefaultZoom(newZoom);
        setLoading(false);
      } else {
        console.error("Không tìm thấy kết quả cho địa chỉ này.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Đã xảy ra lỗi trong quá trình tìm kiếm vị trí.", error);
      setError("Đã xảy ra lỗi trong quá trình tìm kiếm vị trí.");
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

        const newCenter = {
          lat: selectedAddress.lat,
          lng: selectedAddress.lng,
        };
        const newZoom = 15;

        setCoords(newCenter);
        setDefaultZoom(newZoom);
      } else {
        console.error("Không tìm thấy kết quả cho địa chỉ này.");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi trong quá trình tìm kiếm vị trí.", error);
    }
  };
  const Position = ({ lat, lng, text }) => {
    if (lat && lng && text) {
      return (
        <Box style={{ position: "relative" }}>
          {loadingMap && (
            <Box
              style={{
                position: "absolute",
                top: "20%",
                left: "-40%",
                transform: "translate(-0%, -30%)",
              }}
            >
              <CircularProgress color="secondary" disableShrink />
            </Box>
          )}
        
            <animated.div
              style={avatarAnimation} 
            >
              <Avatar src={data?.avatar} size={24} />
            </animated.div>
            <Box style={{ width: "120px" }}>
                <Typography
                  sx={{
                    marginTop:"3px",
                    fontWeight: "bold",
                    color: colors.brown[900],
                    fontSize: "12px",
                  }}
                >
                  {text}
                </Typography>
              </Box>
        </Box>
      );
    } else {
      return null;
    }
  };

  const handleClearAddress = () => {
    setAddress("");
  };
  return (
    <Box
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        margin: "auto",
        overflow: "hidden",
        border: "1px solid black",
        borderRadius: "10px",
      }}
    >
      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyDbkEOpLXI8iXrgd_0qwMul8bVjjKTNcLs",
          }}
          loading={loading}
          defaultCenter={coords}
          defaultZoom={defaultZoom}
          center={coords}
          zoom={defaultZoom}
        >
          {loadingMap ? (
            <Box
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <CircularProgress color="secondary" disableShrink />
            </Box>
          ) : (
            <Position
              lat={coords?.lat}
              lng={coords?.lng}
              text={data?.fullname}
            />
          )}
        </GoogleMapReact>
      )}

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
    </Box>
  );
};

export default Map;
