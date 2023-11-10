import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createOrderOffline } from "../../redux/orderSlice";
import { fetchServices } from "../../redux/serviceSlice";
import { fetchCustomers } from "../../redux/customerSlice";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import GoogleMapReact from "google-map-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  geocodeByPlaceId,
} from "react-places-autocomplete";
import Map from "./google";
const CreateOrderOffline = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [address, setAddress] = useState(""); // Thêm trường address
  const [addressDestination, setAddressDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [latDestination, setLatDestination] = useState(null);
  const [lngDestination, setLngDestination] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [selectedMapAddress, setSelectedMapAddress] = useState("");
  // Hàm xử lý khi bấm vào TextField "departure" để hiển thị modal
  const handleOpenMapModal = () => {
    setShowMapModal(true);
  };

  const handleMapLocationSelected = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      if (results && results.length > 0) {
        const firstResult = results[0];
        const latLng = await getLatLng(firstResult);
        const selectedLocation = {
          lat: latLng.lat,
          lng: latLng.lng,
          address: firstResult.formatted_address,
        };
        const latLngDeparture = `lat:${selectedLocation.lat},long:${selectedLocation.lng}`;
        console.log(latLngDeparture);
        setLat(selectedLocation.lat);
        setLng(selectedLocation.lng);
        setAddress(selectedLocation.address);
        setSelectedMapAddress(selectedLocation.address);

        formikRef.current.setFieldValue("departure", latLngDeparture);
      } else {
        console.error("No results found for this address.");
      }
    } catch (error) {
      console.error(
        "An error occurred while searching for the location.",
        error
      );
    }
  };

  const handleMapLocationSelectedDestination = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      if (results && results.length > 0) {
        const firstResult = results[0];
        const latLng = await getLatLng(firstResult);
        const selectedLocation = {
          lat: latLng.lat,
          lng: latLng.lng,
          address: firstResult.formatted_address,
        };
        const latLngDestination = `lat:${selectedLocation.lat},long:${selectedLocation.lng}`;
        console.log(latLngDestination);
        setLatDestination(selectedLocation.lat);
        setLngDestination(selectedLocation.lng);
        setAddressDestination(selectedLocation.address);
        setSelectedMapAddress(selectedLocation.address);

        // Cập nhật trường "destination"
        formikRef.current.setFieldValue("destination", latLngDestination);
      } else {
        console.error("No results found for this address.");
      }
    } catch (error) {
      console.error(
        "An error occurred while searching for the location.",
        error
      );
    }
  };
  useEffect(() => {
    // Ensure both sets of coordinates are present
    if (lat != null && lng != null && latDestination != null && lngDestination != null) {
      const distance = calculateDistance(lat, lng, latDestination, lngDestination);
      console.log(`Distance: ${distance.toFixed(2)} km`);
      // Here you could set the distance in state or in a form field
      formikRef.current.setFieldValue("distance", distance.toFixed(2));
    }
  }, [lat, lng, latDestination, lngDestination]); // Dependencies array for useEffect
  
  // Rest of your component
  


  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }
  
  function toRad(value) {
    return value * Math.PI / 180;
  }
  

    // Example usage:
    // const point1 = { lat: 10.7756587, lng: 106.7004238 };
    // const point2 = { lat: 10.7935216, lng: 106.73081950 };
    
    // const distanceKm = calculateDistance(point1.lat, point1.lng, point2.lat, point2.lng);
    // console.log(`The distance is ${distanceKm.toFixed(2)} km`);
    

  const checkoutSchema = yup.object().shape({
    customerNote: yup.string().required("Required"),
    departure: yup.string().required("Required"),
    destination: yup.string().required("Required"),
    rescueType: yup.string().required("Required"),
    paymentMethod: yup.string().required("Required"),
    area: yup.string().required("Required"),
    customerId: yup.string().required("Required"),
    service: yup.string().required("Required"),
  });
  const initialValues = {
    customerNote: "",
    departure: "",
    destination: "",
    rescueType: "",
    paymentMethod: "",
    area: "",
    customerId: "",
    service: [],
  };

  // Tạo ref để lưu trữ tham chiếu đến formik
  const formikRef = useRef(null);

  const handleFormSubmit = (values, { resetForm }) => {
    // const selectedUrls = values.url.split(","); // Split URLs by comma or any other delimiter

    // Update the "url" field in the form values with the array
    // values.url = selectedUrls;

    // Create a new array with the selected service names
    const selectedServices = selectedService ? [selectedService.name] : [];

    // Update the "service" field in the form values
    values.service = selectedServices;

    resetForm({ values: initialValues });
    setSelectedService(null);
    setSelectedCustomer(null);
    setAddress(null);
    // In ra tất cả dữ liệu đã nhập
    console.log("Dữ liệu đã nhập:", orders);
    dispatch(createOrderOffline(values))
      .then((response) => {
        console.log(response);
        toast.success("Tạo Đơn Hàng Thành Công");

        // Đặt lại giá trị của formik về giá trị ban đầu (rỗng)
        formikRef.current.resetForm();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            `Lỗi khi tạo đơn hàng trực Offline: ${error.response.data.message}`
          );
        } else {
          toast.error("Lỗi khi lỗi khi tạo đơn hàng trực Offline");
        }
      });
  };
  useEffect(() => {
    const fetchServicesAndCustomers = async () => {
      try {
        const servicesResponse = await dispatch(fetchServices());
        const customersResponse = await dispatch(fetchCustomers());

        const services = servicesResponse.payload.data;
        const customers = customersResponse.payload.data;

        if (services) {
          //lọc dv status "ACTIVE"
          const activeService = services.filter(
            (service) => service.status === "ACTIVE"
          );
          setServicesData(activeService);
        }

        if (customers) {
          setCustomersData(customers);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors if needed
      }
    };

    fetchServicesAndCustomers();
  }, [dispatch]);

  return (
    <Box m="20px">
      <Header
        title="Tạo Mới Đơn Hàng Offline"
        subtitle="Tạo Thông Tin Đơn Hàng Offline"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        // Gán formikRef cho ref
        innerRef={formikRef}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="flex" justifyContent="left" mb="20px">
              <Button type="submit" color="secondary" variant="contained">
                Tạo Dơn Hàng Offline
              </Button>
            </Box>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Ghi Chú Từ Khách Hàng"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.customerNote}
                name="customerNote"
                error={
                  touched.customerNote && errors.customerNote ? true : false
                }
                helperText={touched.customerNote && errors.customerNote}
                sx={{ gridColumn: "span 2" }}
              />

              <Autocomplete
                id="service-select"
                options={servicesData}
                getOptionLabel={(option) => option.name || "Default Name"}
                value={selectedService}
                onChange={(_, newValue) => {
                  setSelectedService(newValue);
                  const selectedServiceName = newValue ? newValue.name : "";
                  handleChange("service")(selectedServiceName);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Danh Sách Dịch Vụ"
                    variant="filled"
                    onBlur={handleBlur}
                    error={touched.service && errors.service ? true : false}
                    helperText={touched.service && errors.service}
                  />
                )}
              />

              <Autocomplete
                id="customer-select"
                options={customersData}
                getOptionLabel={(option) =>
                  option.fullname || "Default Fullname"
                }
                getOptionSelected={(option, value) => option.id === value.id}
                value={selectedCustomer}
                onChange={(_, newValue) => {
                  setSelectedCustomer(newValue);
                  const selectedCustomerId = newValue ? newValue.id : "";
                  handleChange("customerId")(selectedCustomerId);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Danh Sách Khách Hàng"
                    variant="filled"
                    onBlur={handleBlur}
                    error={
                      touched.customerId && errors.customerId ? true : false
                    }
                    helperText={touched.customerId && errors.customerId}
                  />
                )}
              />

              <FormControl fullWidth variant="filled">
                <InputLabel id="rescueType-label">
                  Loại Hình Thức Cứu Hộ
                </InputLabel>
                <Select
                  labelId="rescueType-label"
                  id="rescueType"
                  name="rescueType"
                  value={values.rescueType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.rescueType && errors.rescueType ? true : false}
                >
                  <MenuItem value="Towing">Xe Kéo</MenuItem>
                  <MenuItem value="Fixing">Sửa Tại Chỗ Cơ Bản</MenuItem>
                </Select>
              </FormControl>

              <Modal
                style={{
                  marginLeft: "200px",
                  marginTop: "60px",
                  width: "1200px",
                  height: "600px",
                }}
                open={showMapModal}
                onClose={() => setShowMapModal(false)}
              >
                <Map onLocationSelected={handleMapLocationSelected} />
              </Modal>

              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Địa Chỉ Kéo Đến"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.destination}
                name="destination"
                error={touched.destination && errors.destination ? true : false}
                helperText={touched.destination && errors.destination}
                sx={{ gridColumn: "span 2" }}
              /> */}

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Khoảng cách "
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.distance}
                name="distance"
                error={touched.distance && errors.distance ? true : false}
                helperText={touched.distance && errors.distance}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl fullWidth variant="filled">
                <InputLabel id="paymentMethod-label">
                  Phương Thức Thanh Toán
                </InputLabel>
                <Select
                  labelId="paymentMethod-label"
                  id="paymentMethod"
                  name="paymentMethod"
                  value={values.paymentMethod}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.paymentMethod && errors.paymentMethod ? true : false
                  }
                >
                  <MenuItem value="Cast">Tiền Mặt</MenuItem>
                  <MenuItem value="Bank">Chuyển Khoản</MenuItem>
                  <MenuItem value="Momo">Momo</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="filled">
                <InputLabel id="area-label">Khu Vực</InputLabel>
                <Select
                  labelId="area-label"
                  id="area"
                  name="area"
                  value={values.area}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.area && errors.area ? true : false}
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                </Select>
              </FormControl>
              <div>
                <PlacesAutocomplete
                  value={address}
                  onChange={setAddress}
                  onSelect={handleMapLocationSelected}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <div style={{ position: "relative" }}>
                      <TextField
                        {...getInputProps({
                          placeholder: "Nhập địa chỉ xe hư",
                          variant: "filled",
                          fullWidth: true,
                          InputProps: {
                            endAdornment: (
                              <IconButton onClick={handleOpenMapModal}>
                                <EditLocationAltIcon />
                              </IconButton>
                            ),
                          },
                        })}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          zIndex: 1,
                          maxHeight: "200px",
                          overflowY: "auto",
                          backgroundColor: "white",
                          border: "1px solid #ccc",
                        }}
                      >
                        {suggestions.map((suggestion, index) => {
                          const style = {
                            backgroundColor: suggestion.active
                              ? "#fafafa"
                              : "#fff",
                          };
                          return (
                            <div
                              key={index}
                              {...getSuggestionItemProps(suggestion, { style })}
                            >
                              {suggestion.description}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>

              <div>
                <PlacesAutocomplete
                  value={addressDestination}
                  onChange={setAddressDestination}
                  onSelect={handleMapLocationSelectedDestination}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <div style={{ position: "relative" }}>
                      <TextField
                        {...getInputProps({
                          placeholder: "Nhập địa chỉ kéo đến",
                          variant: "filled",
                          fullWidth: true,
                          InputProps: {
                            endAdornment: (
                              <IconButton onClick={handleOpenMapModal}>
                                <EditLocationAltIcon />
                              </IconButton>
                            ),
                          },
                        })}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          zIndex: 1,
                          maxHeight: "200px",
                          overflowY: "auto",
                          backgroundColor: "white",
                          border: "1px solid #ccc",
                        }}
                      >
                        {suggestions.map((suggestion, index) => {
                          const style = {
                            backgroundColor: suggestion.active
                              ? "#fafafa"
                              : "#fff",
                          };
                          return (
                            <div
                              key={index}
                              {...getSuggestionItemProps(suggestion, { style })}
                            >
                              {suggestion.description}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateOrderOffline;
