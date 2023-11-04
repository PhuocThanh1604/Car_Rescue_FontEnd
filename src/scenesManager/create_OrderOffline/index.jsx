import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
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
  const [departure, setDeparture] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [selectedMapAddress, setSelectedMapAddress] = useState("");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Hàm xử lý khi bấm vào TextField "departure" để hiển thị modal
  const handleOpenMapModal = () => {
    setShowMapModal(true);
  };

  // Hàm xử lý khi địa chỉ được xác nhận và tọa độ lat và lng được chọn
  const handleMapLocationSelected = (selectedLocation) => {
    const { lat, lng, address } = selectedLocation;
    const latLngString = `lat:${lat},lng:${lng}`; // Combine lat and lng values as a string
    setLat(lat);
    setLng(lng);
    setSelectedMapAddress(address);
    setIsMapModalOpen(false);
    setDeparture(latLngString); // Set the formatted value as the 'departure' field
    formikRef.current.setFieldValue('departure', latLngString);
  };
  
  

  const checkoutSchema = yup.object().shape({
    customerNote: yup.string().required("Required"),
    departure: yup.string().required("Required"),
    destination: yup.string().required("Required"),
    rescueType: yup.string().required("Required"),
    paymentMethod: yup.string().required("Required"),
    area: yup.string().required("Required"),
    customerId: yup.string().required("Required"),
    url: yup.string().required("Required"),
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
    url: [], // Wrap the string in an array
    service: [],
  };

  // Tạo ref để lưu trữ tham chiếu đến formik
  const formikRef = useRef(null);

  const handleFormSubmit = (values, { resetForm }) => {
    const selectedUrls = values.url.split(","); // Split URLs by comma or any other delimiter

    // Update the "url" field in the form values with the array
    values.url = selectedUrls;

    // Create a new array with the selected service names
    const selectedServices = selectedService ? [selectedService.name] : [];

    // Update the "service" field in the form values
    values.service = selectedServices;

    resetForm({ values: initialValues });
    setSelectedService(null);
    setSelectedCustomer(null);
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
          setServicesData(services);
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

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Hình Ảnh"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.url} // Join the array into a comma-separated string
                name="url"
                error={touched.url && errors.url ? true : false}
                helperText={touched.url && errors.url}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Địa Chỉ Xe Hư"
                onBlur={handleBlur}
                onChange={(e) => {
                  if (!showMapModal) {
                    setAddress(e.target.value);
                  }
                }}
                value={departure} 
                name="departure"
                error={touched.departure && errors.departure ? true : false}
                helperText={touched.departure && errors.departure}
                sx={{ gridColumn: "span 2" }}
                onClick={handleOpenMapModal}
              />

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

              <TextField
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
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateOrderOffline;
