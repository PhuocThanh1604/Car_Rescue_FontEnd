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
import { editTechnician } from "../../redux/technicianSlice";

const UpdateTechnician = () => {
  const dispatch = useDispatch();
  const technicians = useSelector((state) => state.technician.technicians);
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
    id: yup.string().required("Required"),
  });
  const statusOptions = ["Active", "unactive"];
  const initialValues = {
    fullname: "",
    sex: "",
    status: "",
    birthdate: "",
    address: "",
    phone: "",
    avatar: "",
    accountId: "",
    id: "",
  };

  // Tạo ref để lưu trữ tham chiếu đến formik
  const formikRef = useRef(null);

  // const handleFormSubmit = (values, { resetForm }) => {
  //   console.log('Form Values:', values);
  //   resetForm({ values: initialValues });

  //   dispatch(editTechnician(values))
  //     .then((response) => {
  //       // Đảm bảo payload chứa dữ liệu kỹ thuật viên đã chỉnh sửa
  //       const updatedTechnician = response.payload.data;

  //       if (updatedTechnician) {
  //         // Cập nhật trạng thái Redux hoặc gọi lại hàm fetchTechnicians
  //         // Tùy thuộc vào cách bạn thiết kế ứng dụng Redux của mình
  //         // Ví dụ: dispatch(settechnicians(updatedTechnician));
  //         // hoặc dispatch(fetchTechnicians());

  //         toast.success("Cập nhật kỹ thuật viên thành công");
  //       } else {
  //         toast.error("Không có dữ liệu kỹ thuật viên sau khi cập nhật");
  //       }

  //       formikRef.current.resetForm();
  //     })
  //     .catch((error) => {
  //       toast.error("Lỗi khi cập nhật kỹ thuật viên", error);
  //     });
  // };
  const handleFormSubmit = (values, { resetForm }) => {
    resetForm({ values: initialValues });

    dispatch(editTechnician({ data: values }))
      .then((response) => {
        // Dispatch an action or fetch technicians here if needed
        // Example: dispatch(settechnicians(updatedTechnician));
        toast.success("Cập nhật kỹ thuật viên thành công");
        formikRef.current.resetForm();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            `Lỗi khi cập nhật kỹ thuật viên: ${error.response.data.message}`
          );
        } else {
          toast.error("Lỗi khi cập nhật kỹ thuật viên");
        }
      });
  };

  return (
    <Box m="20px">
      <Header
        title="Update Thông Tin"
        subtitle="Chỉnh Sửa Thông Tin Kỹ Thuật Viên"
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
                Tạo Kỹ Thuật Viên
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
                label="id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id}
                name="id"
                error={touched.id && errors.id ? true : false}
                helperText={touched.id && errors.id}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="accountId"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.accountId}
                name="accountId"
                error={touched.accountId && errors.accountId ? true : false}
                helperText={touched.accountId && errors.accountId}
                sx={{ gridColumn: "span 2" }}
              />
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
              {/* <Autocomplete
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
              /> */}

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Giới Tính"
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
                label="Hình Ảnh"
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
                label="Ngày Sinh"
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

export default UpdateTechnician;
