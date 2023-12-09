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
import MapboxMap from "./mapbox";
import { useDispatch } from "react-redux";
import { getAllLocationTechnician, getTechnicianId } from "../../redux/technicianSlice";
import { toast } from "react-toastify";
import { tokens } from "../../theme";

const Map = () => {
  const dispatch = useDispatch();
  const [coords, setCoords] = useState(null);
  const [dataTechnician, setDataTechnician] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 10.7983303,
    lng: 106.6428588,
  });
  const [infoTechnician, setInfoTechnician] = useState({});
  const [technicianCoordinates, setTechnicianCoordinates] = useState([]);
  const [allTechnicianInfos, setAllTechnicianInfos] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [defaultZoom, setDefaultZoom] = useState(11);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  const [technicianLocation, setTechnicianLocation] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
  useEffect(() => {
    
    setLoading(true);
    dispatch(getAllLocationTechnician())
      .then((response) => {
        const technicianDetails = response.payload.data;

        if (Object.keys(technicianDetails).length > 0) {
          const coordinates = [];
  const tempAllTechnicianInfos = [];
          
          // Loop through all technicians
          for (const technicianId in technicianDetails) {
            if (technicianDetails.hasOwnProperty(technicianId)) {
              const technician = technicianDetails[technicianId];
              const { lat, long } = technician;

              // Do something with lat and long
              console.log(`Technician ID: ${technicianId}, Lat: ${lat}, Long: ${long}`);

              const parsedLat = parseFloat(lat);
              const parsedLong = parseFloat(long);

              if (!isNaN(parsedLat) && !isNaN(parsedLong)) {
                coordinates.push({ lat: parsedLat, lng: parsedLong });

                
                dispatch(getTechnicianId({ id: technicianId }))
                  .then((response) => {
                    const technicianInfo = response.payload.data;
                    tempAllTechnicianInfos.push(technicianInfo);
                    console.log(technicianInfo);
                
                    // Check if all technician information has been fetched
                    if (tempAllTechnicianInfos.length || Object.keys(technicianDetails).length) {
                      setInfoTechnician([...tempAllTechnicianInfos]); // Use spread to create a new array
                      console.log(tempAllTechnicianInfos);
                    }
                    console.log(infoTechnician);
                   
                  })
                  .catch((error) => {
                    toast.error("Lỗi khi lấy thông tin kỹ thuật viên:", error);
                  });
              } else {
                console.warn(`Invalid coordinates for Technician ID: ${technicianId}`);
              }
            }
          }

          // Set technician coordinates in the state
          setTechnicianCoordinates(coordinates);

          // Assuming you want to set the first technician's location as the main technicianLocation
          const firstTechnicianId = Object.keys(technicianDetails)[0];
          const firstTechnician = technicianDetails[firstTechnicianId];
          const firstBodyObj = JSON.parse(firstTechnician.body);
          const firstLat = parseFloat(firstBodyObj.lat);
          const firstLng = parseFloat(firstBodyObj.long);

          if (!isNaN(firstLat) && !isNaN(firstLng)) {
            setTechnicianLocation({ lat: firstLat, lng: firstLng });
            setIsSuccess(true);
          } else {
            setDataTechnician(null);
            setIsSuccess(false);
            toast.error("Dữ liệu vị trí của kỹ thuật viên không tìm thấy");
          }
        } else {
          setDataTechnician(null);
          setIsSuccess(false);
          toast.error("Không có dữ liệu trả về từ getLocationTechnician");
        }
      })
      .catch((error) => {
        toast.error("Lỗi khi lấy dữ liệu kỹ thuật viên:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);


  useEffect(() => {
    if (technicianLocation) {
      setCoords(technicianLocation);
      setLoading(loading);
      setDefaultZoom(17);
    } else {
      setCoords({ lat: defaultCenter.lat, lng: defaultCenter.lng });
      setLoading(false);
      setDefaultZoom(defaultZoom);
    }
  }, [technicianLocation, loading]);

  const Position = ({ lat, lng, text, avatar }) => {
    if (lat !== undefined && lng !== undefined) {
      // Render the marker only if valid coordinates are available
      return (
        <Box style={{ position: "relative" }}>
          <Avatar src={avatar} size={24} />
          <Box
            style={{
              width: "120px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                color: colors.redAccent[500],
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
    <div
      style={{
        height: "96%",
        width: "98%",
        position: "relative",
        margin: "10px",
        border: "1.4px solid black",
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyBSLmhb6vCHhrZxMh3lmUI-CICfzhiMakk",
        }}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
      >
       {/* <Position lat={coords?.lat} lng={coords?.lng} text="You are here" /> */}
      {technicianLocation && (
        <Position lat={technicianLocation.lat} lng={technicianLocation.lng} text="Technician" />
      )}
      {technicianCoordinates.map((coordinate, index) => (
        <Position key={index} lat={coordinate.lat} lng={coordinate.lng}
        
        
        text={infoTechnician[index]?.fullname || 'Unknown'}
               
        avatar={infoTechnician[index]?.avatar || ''}
        
        
        
        />
      ))}
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "8px",
                }}
              >
                <FormControl>
                  <TextField
                    {...getInputProps({
                      placeholder: "Nhập địa chỉ",
                      style: {
                        height: "52px",
                        width: "400px",
                        marginRight: "5px",
                        borderRadius: "8px",
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

      {/* <MapboxMap/> */}
    </div>
  );
};

export default Map;
