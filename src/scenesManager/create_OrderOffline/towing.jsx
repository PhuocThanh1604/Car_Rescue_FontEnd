import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Tooltip,
  Typography,
  colors,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import AddIcon from "@mui/icons-material/Add";
import { createOrderOffline, sendSMS } from "../../redux/orderSlice";
import { fetchServices, fetchSymptom } from "../../redux/serviceSlice";
import { fetchCustomers } from "../../redux/customerSlice";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import Map from "./google";
import InfoIcon from "@mui/icons-material/Info";
import areaData from "../../data.json";
import { FaMapMarkerAlt } from "react-icons/fa";
const CreateOrderOffline = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [symptomData, setSymptomData] = useState([]);
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
  const [isDestinationSelected, setIsDestinationSelected] = useState(false);
  const [selectedMapAddress, setSelectedMapAddress] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(true);
  const [isRescueTypeSelected, setIsRescueTypeSelected] = useState(false);
  const [selectedRescueType, setSelectedRescueType] = useState("");
  const [distanceValue, setDistanceValue] = useState("");

  const [dataJson, setDataJson] = useState([]);
  const getValidationSchema = () => {
    let schema = {
      customerNote: yup.string().required("Vui lòng nhập ghi chú"),
      departure: yup.string().required("Vui lòng nhập địa chỉ"),
      rescueType: yup.string().required("Vui lòng nhập hình thức"),
      paymentMethod: yup.string().required("Vui lòng nhập phương thức"),
      area: yup.string().required("Vui lòng nhập khu vực"),
      customerId: yup.string().required("Yêu cầu"),
      carId: yup.string(),
      service: yup.string().required("Vui lòng nhập dịch vụ"),
      to: yup.string().required("Vui lòng nhập số điện thoại"),
      nameCustomer: yup.string().required("Vui lòng nhập tên khách hàng"),
    };

    if (selectedRescueType === "Towing") {
      schema.destination = yup.string().required("Vui lòng nhập địa chỉ");
      schema.service = yup
        .mixed()
        .test(
          'is-string-or-array',
          'Vui lòng nhập dịch vụ',
          (value) => typeof value === 'string' || (Array.isArray(value) && value.length > 0)
        );
    } else {
      schema.service = yup.string().required("Vui lòng nhập dịch vụ");
    }
    return yup.object().shape(schema);
  };

  const initialValues = {
    customerNote: "",
    nameCustomer: "",
    distance: "",
    destination: "",
    departure: "",
    rescueType: "",
    paymentMethod: "",
    area: "",
    customerId: "",
    service: [],
    carId: "",
    to: "",
  };
  useEffect(() => {
    if (dataJson.area && dataJson.area.length > 0) {
      console.log(dataJson.area[0].name || "Không có ");
    } else {
      console.log("Không có dữ liệu");
    }
    setDataJson(areaData);
  }, [dataJson]);

  const filteredServices = servicesData.filter((service) => {
    if (isRescueTypeSelected) {
      if (selectedRescueType === "Towing") {
        return service.type === "Towing";
      } else {
        return true;
      }
    }
    return false;
  });

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
        // formikRef.current.setFieldValue("address", selectedLocation.address);
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
        setIsDestinationSelected(true);
        setSelectedMapAddress(selectedLocation.address);

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
  if (
    lat != null &&
    lng != null &&
    latDestination != null &&
    lngDestination != null
  ) {
    const distance = calculateDistance(lat, lng, latDestination, lngDestination);
    console.log(distance);
    
    if (distance > 100 && parseFloat(distanceValue) <= 100) {
      // Khoảng cách hợp lệ và đã vượt quá trước đó, giảm xuống dưới 100km
      toast.warning("Khoảng cách dưới 100km");
    }

    setDistanceValue(distance.toFixed(2));
    // Cập nhật trường "distance" nếu khoảng cách hợp lệ
    formikRef.current.setFieldValue("distance", distance.toFixed(2));
    formikRef.current.setValues({
      ...formikRef.current.values,
      distance: distance.toFixed(2),
    });
  }
}, [lat, lng, latDestination, lngDestination]);


  // Rest of your component

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadian = (n) => (n * Math.PI) / 180;

    let dLat = toRadian(lat2 - lat1);
    let dLon = toRadian(lon2 - lon1);
    let R = 6371; // Radius of the Earth in kilometers
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) *
        Math.cos(toRadian(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in kilometers
    return d;
  }
  const handleTowingFormSubmit = (values, { resetForm }) => {
    if (distanceValue > 100) {
      toast.warning(
        "Khoảng cách vượt quá 100km. Vui lòng chọn một địa chỉ khác."
      );
      return;
    }
    console.log(selectedRescueType);
    console.log(values.nameCustomer);
    const initialPhoneNumber = "+84";
    const customer_name = values.nameCustomer;
    const service = values.service;
    const symptom = values.symptom;
    const order_phone = initialPhoneNumber + values.to;
    const type_payment = values.paymentMethod;
    const sms_message = `Xin chào ${customer_name}!  \nDịch vụ: ${service}\nĐơn hàng: ${order_phone} 
     của bạn đã được nhận và đang được xử lý. Hình thức thanh toán: ${type_payment}. Cảm ơn bạn đã mua hàng!`;
    const { ...submissionValues } = values;
    submissionValues.service = [values.service];
    submissionValues.distance = distanceValue;
    console.log("Submitting Fixing data:", submissionValues);
    dispatch(createOrderOffline(submissionValues))
      .then((response) => {
        console.log(response);
        if (response.payload.message === "Hiện tại không còn xe") {
          toast.warn("Hiện tại không có kỹ thuật viên vui lòng đợi");
        } else if (response.payload.message === "Success") {
          toast.success("Tạo đơn thành công");
          const smsData = {
            to: order_phone,
            body: sms_message,
          };
          dispatch(sendSMS(smsData))
            .then((smsResponse) => {
              console.log("Tin nhắn SMS đã được gửi:", smsResponse);
            })
            .catch((smsError) => {
              console.error("Lỗi khi gửi tin nhắn SMS:", smsError);
            });
        }
        formikRef.current.setFieldValue("to", "");
        formikRef.current.setFieldValue("nameCustomer", "");
        formikRef.current.resetForm();
        setSelectedService(null);
        setSelectedSymptom(null);
        setAddress("");
        setAddressDestination("");
        setIsDestinationSelected(false);
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
    // ...
  };

  // Tạo ref để lưu trữ tham chiếu đến formik
  const formikRef = useRef(null);

  const handleFormSubmit = (values, { resetForm }) => {
    console.log(selectedRescueType);
    // Check selectedRescueType and call appropriate handler
    if (selectedRescueType === "Towing") {
      handleTowingFormSubmit(values, { resetForm });
    }
  };

  useEffect(() => {
    setSelectedService(null);
    setSelectedSymptom(null);
    console.log(selectedRescueType);
  }, [selectedRescueType]);

  useEffect(() => {
    const fetchServicesAndCustomers = async () => {
      try {
        const servicesResponse = await dispatch(fetchServices());
        const customersResponse = await dispatch(fetchCustomers());

        const services = servicesResponse.payload.data;
        const customers = customersResponse.payload.data;

        if (services) {
          const activeService = services.filter(
            (service) => service.status === "ACTIVE"
          );
          setServicesData(activeService);
        }
        if (customers) {
          const offlineCustomer = customers.find(
            (customer) => customer.fullname === "Khách Hàng Offline"
          );

          if (offlineCustomer) {
            setSelectedCustomer(offlineCustomer);
            // Nếu bạn cần cập nhật initialValues của Formik
            formikRef.current.setFieldValue("customerId", offlineCustomer.id);
          }

          setCustomersData(customers); // hoặc setCustomersData(offlineCustomers) nếu bạn muốn lọc
        }

        setLoading(false);
      } catch (error) {
        toast.dismiss("Error fetching data:", error);
        // Xử lý lỗi nếu cần thiết
      }
    };

    fetchServicesAndCustomers();
  }, [dispatch]);

  return (
    <Box m="20px">
      <Header
        title="Tạo Mới Đơn Hàng Offline Kéo Xe"
        subtitle="Tạo Thông Tin Đơn Hàng Offline Kéo Xe"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
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
            <Box
              display="flex"
              justifyContent="left"
              alignItems="center"
              mb="20px"
            >
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disableElevation
                onClick={handleSubmit}
                sx={{
                  color: "black", // Change 'green' to your desired text color
                  "& .MuiSvgIcon-root": {
                    color: "black", // Change 'blue' to your desired icon color
                    marginLeft: "4px", // Adjust the space between icon and text
                    fontWeight: "bold",
                  },
                }}
              >
                <AddIcon /> Tạo Đơn Hàng Offline
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
                variant="outlined"
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.carId}
                error={touched.carId && errors.carId ? true : false}
                helperText={touched.carId && errors.carId}
                sx={{ gridColumn: "span 2", display: "none" }}
              />
              <TextField
                fullWidth
                variant="outlined"
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
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Tên Khách Hàng"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nameCustomer}
                name="nameCustomer"
                error={
                  touched.nameCustomer && errors.nameCustomer ? true : false
                }
                helperText={touched.nameCustomer && errors.nameCustomer}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                type="tel"
                inputMode="tel"
                label="SĐT Khách Hàng"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalPhoneIcon />
                      <Typography
                        sx={{
                          marginLeft: "6px",
                          fontWeight: "2rem",
                          fontSize: "16px",
                        }}
                      >
                        +84:
                      </Typography>
                      <Divider orientation="vertical" sx={{ height: "auto" }} />
                    </InputAdornment>
                  ),
                  inputProps: {
                    type: "tel",
                    inputMode: "tel",
                  },
                }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.to}
                name="to"
                error={touched.to && Boolean(errors.to)}
                helperText={touched.to && errors.to ? errors.to : ""}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl fullWidth>
                <InputLabel id="rescueType-label">
                  Loại Hình Thức Cứu Hộ
                </InputLabel>
                <Select
                  labelId="rescueType-label"
                  id="rescueType"
                  name="rescueType"
                  label="Loại Hình Thức Cứu Hộ"
                  variant="outlined"
                  value={values.rescueType}
                  onChange={(event) => {
                    handleChange(event); // Gọi handleChange của Formik
                    setIsRescueTypeSelected(event.target.value !== ""); // Cập nhật trạng thái
                    setSelectedRescueType(event.target.value);
                  }}
                  onBlur={handleBlur}
                  error={touched.rescueType && errors.rescueType ? true : false}
                  helperText={
                    touched.rescueType && errors.rescueType
                      ? errors.rescueType
                      : ""
                  }
                >
                  <MenuItem value="Towing">Xe Kéo</MenuItem>
                </Select>
              </FormControl>
              {selectedRescueType === "Towing" && (
                    <Autocomplete
                    id="service-select"
                    disabled={!isRescueTypeSelected}
                    options={filteredServices}
                    getOptionLabel={(option) => option.name || "Default Name"}
                    value={selectedService}
                    onChange={(_, newValue) => {
                      setSelectedService(newValue);
                      const selectedServiceName = newValue ? newValue.name : ""; // Lấy tên dịch vụ
                      handleChange("service")(selectedServiceName.toString()); // Chuyển đổi thành chuỗi và gán
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Danh Sách Dịch Vụ"
                        variant="outlined"
                        onBlur={handleBlur}
                        error={touched.service && errors.service ? true : false}
                        helperText={touched.service && errors.service }
                      />
                    )}
                  />
              )}
          

              <div style={{ display: "none" }}>
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
                      variant="outlined"
                      onBlur={handleBlur}
                      error={
                        touched.customerId && errors.customerId ? true : false
                      }
                      helperText={touched.customerId && errors.customerId}
                    />
                  )}
                />
              </div>

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

              <FormControl fullWidth variant="outlined">
                <InputLabel id="area-label">Khu Vực</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="area"
                  name="area"
                  variant="outlined"
                  label="Khu Vực"
                  value={values.area}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.area && errors.area ? true : false}
                >
                  {dataJson?.area &&
                    dataJson.area.length >= 3 &&
                    dataJson.area.slice(0, 3).map((item, index) => (
                      <MenuItem value={item.value}>
                        {item.name}
                        <Tooltip
                          key={index}
                          title={
                            item.description
                              ? item.description
                                  .split("\n")
                                  .map((line, i) => <div key={i}>{line}</div>)
                              : "Không có mô tả"
                          }
                        >
                          <InfoIcon
                            style={{ marginLeft: "5px", fontSize: "16px" }}
                          />
                        </Tooltip>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="paymentMethod-label">
                  Phương Thức Thanh Toán
                </InputLabel>
                <Select
                  labelId="paymentMethod-label"
                  id="paymentMethod"
                  name="paymentMethod"
                  variant="outlined"
                  label="Phương Thức Thanh Toán"
                  value={values.paymentMethod}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.paymentMethod && errors.paymentMethod ? true : false
                  }
                >
                  <MenuItem value="Cash">Tiền Mặt</MenuItem>
                  <MenuItem value="Banking">Chuyển Khoản</MenuItem>
                </Select>
              </FormControl>

              <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleMapLocationSelected}
                sx={{ gridColumn: "span 2", width: "80vw" }}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                  <div style={{ position: "relative" }}>
                    <TextField
                      {...getInputProps({
                        placeholder: "Nhập địa chỉ bắt đầu",
                        variant: "outlined",
                        fullWidth: true,
                        InputProps: {
                          endAdornment: (
                            <IconButton onClick={handleOpenMapModal}>
                              <EditLocationAltIcon />
                            </IconButton>
                          ),
                        },
                      })}
                      error={
                        touched.departure && errors.departure ? true : false
                      }
                      helperText={touched.departure && errors.departure}
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
                      }}
                    >
                      {suggestions.map((suggestion, index) => {
                        const style = {
                          backgroundColor: suggestion.active
                            ? "#41b6e6"
                            : "#fff",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "400px",
                        };
                        return (
                          <div
                            key={index}
                            {...getSuggestionItemProps(suggestion, { style })}
                          >
                            <FaMapMarkerAlt
                              style={{
                                color: colors.cyan[200],
                                marginTop: "5px",
                                marginLeft: "5px",
                                marginRight: "5px",
                              }}
                            />
                            {suggestion.description}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>

              {selectedRescueType === "Towing" && (
                <PlacesAutocomplete
                  value={addressDestination}
                  onChange={setAddressDestination}
                  onSelect={handleMapLocationSelectedDestination}
                  sx={{ gridColumn: "span 2", width: "80vw" }}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <div style={{ position: "relative" }}>
                      <TextField
                        {...getInputProps({
                          placeholder: "Nhập địa chỉ kết thúc",
                          variant: "outlined",
                          fullWidth: true,
                          InputProps: {
                            endAdornment: (
                              <IconButton onClick={handleOpenMapModal}>
                                <EditLocationAltIcon />
                              </IconButton>
                            ),
                          },
                        })}
                        error={
                          touched.destination && errors.destination
                            ? true
                            : false
                        }
                        helperText={touched.destination && errors.destination}
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
                        }}
                      >
                        {suggestions.map((suggestion, index) => {
                          const style = {
                            backgroundColor: suggestion.active
                              ? "#41b6e6"
                              : "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "400px",
                          };
                          return (
                            <div
                              key={index}
                              {...getSuggestionItemProps(suggestion, {
                                style,
                              })}
                            >
                              <FaMapMarkerAlt
                                style={{
                                  color: colors.cyan[200],
                                  marginTop: "5px",
                                  marginLeft: "5px",
                                  marginRight: "5px",
                                }}
                              />
                              {suggestion.description}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              )}

              {isDestinationSelected && (
                // Trong phần JSX:
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Khoảng cách "
                  onBlur={handleBlur}
                  value={distanceValue}
                  name="distance"
                  error={
                    (touched.distance && errors.distance) || // Kiểm tra lỗi từ formik
                    (distanceValue && parseFloat(distanceValue) > 100) // Kiểm tra khoảng cách vượt quá 100km
                      ? true
                      : false
                  }
                  helperText={
                    touched.distance && errors.distance // Hiển thị lỗi từ formik
                      ? errors.distance
                      : distanceValue && parseFloat(distanceValue) > 100 // Hiển thị lỗi khoảng cách vượt quá 100km
                      ? "Khoảng cách vượt quá 100km"
                      : ""
                  }
                  sx={{
                    gridColumn: "span 1",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">km</InputAdornment>
                    ),
                  }}
                  readOnly={selectedRescueType !== "Towing"}
                />
              )}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateOrderOffline;
