


import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
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
import { createAccount, getAccountEmail } from "../../redux/accountSlice";
import { createRescueVehicleOwner } from "../../redux/rescueVehicleOwnerSlice";

const AddCustomer = () => {
  const dispatch = useDispatch();
  const rescueVehicleOwner = useSelector(
    (state) => state.rescueVehicleOwner.rescueVehicleOwners
  );
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const checkoutSchema = yup.object().shape({
    fullname: yup.string().required("Required"),
    sex: yup.string().required("Required"),
    status: yup.string().required("Required"),
    address: yup.string().required("Required"),
    phone: yup.string().required("Required"),
    avatar: yup.string().required("Required"),
    birthdate: yup.date().required("Required"), // Date validation
    accountId: yup.string().required("Required"),
  });
  const statusOptions = ["ACTIVE", "Unactive"];
  const initialValues = {
    fullname: "",
    sex: "",
    status: "",
    birthdate: "",
    address: "",
    phone: "",
    avatar: "",
    accountId: "",
  };

  // Tạo ref để lưu trữ tham chiếu đến formik
  const formikRef = useRef(null);

  const handleFormSubmit = (values, { resetForm }) => {
    resetForm({ values: initialValues });
    setSelectedAccount(null); 
    // In ra tất cả dữ liệu đã nhập
    console.log("Dữ liệu đã nhập:", rescueVehicleOwner);
    dispatch(createRescueVehicleOwner(values))
      .then((response) => {
        console.log(response);
        toast.success("Tạo Tài Khoản Thành Công");

        // Đặt lại giá trị của formik về giá trị ban đầu (rỗng)
        formikRef.current.resetForm();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(`Lỗi khi tạo khách hàng: ${error.response.data.message}`);
        } else {
          toast.error("Lỗi khi tạo khách hàng");
        }
      });
  };
  useEffect(() => {
    dispatch(getAccountEmail())
      .then((response) => {
        const data = response.payload.data;

        if (data) {
          setData(data);
          setLoading(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);
  return (
    <Box m="20px">
      <Header title="Tạo Thông Tin" subtitle="Tạo Thông Tin Khách Hàng" />

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
                Tạo Chủ Xe Cứu Hộ
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
                label="Họ Và Tên"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullname}
                name="fullname"
                error={touched.fullname && errors.fullname ? true : false}
                helperText={touched.fullname && errors.fullname}
                sx={{ gridColumn: "span 2" }}
              />
              <Autocomplete
                id="account-select"
                options={data}
                getOptionLabel={(option) => option.email}
                getOptionSelected={(option, value) => option.id === value.id}
                value={selectedAccount}
                onChange={(_, newValue) => {
                  console.log("Selected Account:", newValue);
                  setSelectedAccount(newValue);
                  const selectedAccountId = newValue ? newValue.id : "";
                  console.log("Selected Account ID:", selectedAccountId);

                  // Use Formik's handleChange to update the 'accountId' field
                  handleChange("accountId")(selectedAccountId);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Danh Sách Tài Khoản"
                    variant="filled"
                    onBlur={handleBlur}
                    error={touched.accountId && errors.accountId ? true : false}
                    helperText={touched.accountId && errors.accountId}
                  />
                )}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="sex"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sex}
                name="sex"
                error={touched.sex && errors.sex ? true : false}
                helperText={touched.sex && errors.sex}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Địa Chỉ"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={touched.address && errors.address ? true : false}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="phone"
                label="Số Điện Thoại"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={touched.phone && errors.phone ? true : false}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="phone"
                label="Avatar"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.avatar}
                name="avatar"
                error={touched.avatar && errors.avatar ? true : false}
                helperText={touched.avatar && errors.avatar}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.birthdate}
                name="birthdate"
                error={touched.birthdate && errors.birthdate ? true : false}
                helperText={touched.birthdate && errors.birthdate}
                sx={{ gridColumn: "span 2" }}
              />
              <Box sx={{ minWidth: 120 }}>
                <FormControl
                  fullWidth
                  error={!!touched.status && !!errors.status}
                >
                  <InputLabel id="demo-simple-select-label">
                    Trạng Thái
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Trạng Thái"
                    variant="outlined"
                    className="filter-select"
                    name="status"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.status}
                    sx={{ gridColumn: "span 4" }}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddCustomer;
