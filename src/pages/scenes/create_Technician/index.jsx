import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { createTechnician } from "../../../redux/technicianSlice";
import AddIcon from "@mui/icons-material/Add";
import { getAccountEmail } from "../../../redux/accountSlice";
import Header from "../../../components/Header";
import UploadImageField from "../../../components/uploadImage";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const Addtechnician = () => {
  const dispatch = useDispatch();
  const technician = useSelector((state) => state.technician.technicians);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(data.avatar || "");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleImageUploaded = (imageUrl) => {
    setDownloadUrl(imageUrl);
    // Set the avatar value to the uploaded image URL
    formikRef.current.setFieldValue("avatar", imageUrl);
  };
  const checkoutSchema = yup.object().shape({
    fullname: yup.string().required("Required"),
    sex: yup.string().required("Required"),
    status: yup.string().required("Required"),
    address: yup.string().required("Required"),
    phone: yup.string().required("Required"),
    avatar: yup.string().required("Required"),
    birthdate: yup.date().required("Required"),
    accountId: yup.string().required("Required"),
    createAt: yup.date().required("Required"),
    area: yup.string().required("Required"),
  });
  const statusMapping = {
    ACTIVE: "Hoạt Động",
    INACTIVE: "Không Hoạt Động",
    // Thêm các trạng thái khác nếu cần thiết
  };
  const initialValues = {
    fullname: "",
    sex: "",
    status: "",
    birthdate: "",
    address: "",
    phone: "",
    avatar: "",
    accountId: "",
    createAt: new Date(),
    area: "",
  };

  // Tạo ref để lưu trữ tham chiếu đến formik
  const formikRef = useRef(null);

  const handleFormSubmit = (values, { resetForm }) => {
    resetForm({ values: initialValues });
    setSelectedAccount(null);
    // In ra tất cả dữ liệu đã nhập
    console.log("Dữ liệu đã nhập:", technician);
    dispatch(createTechnician(values))
      .then((response) => {
        if (response.payload.status === "Success") {
          toast.success("Tạo Tài Khoản Thành Công");

          // Đặt lại giá trị của formik về giá trị ban đầu (rỗng)
          formikRef.current.resetForm();
        } else {
          toast.error("Tạo Tài Khoản không Thành Công vui lòng thử lại");
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            `Lỗi khi tạo chủ xe cứu hộ: ${error.response.data.message}`
          );
        } else {
          toast.error("Lỗi khi lỗi khi tạo chủ xe cứu hộ");
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
      .catch((error) => {
        setLoading(false);
        toast.dismiss("Lỗi khi lấy dữ liệu báo cáo:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);
  return (
    <Box m="20px">
      <Header title="Tạo Thông Tin" subtitle="Tạo Thông Tin Kỹ Thuật Viên" />

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
                <AddIcon /> Tạo Kỹ Thuật Viên
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
                label="Họ Và Tên"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullname}
                name="fullname"
                error={touched.fullname && errors.fullname ? true : false}
                helperText={touched.fullname && errors.fullname}
                sx={{ gridColumn: "span 1" }}
              />
            <Box
                display="flex"
                alignItems="center"
                sx={{ gridColumn: "span 1", gap: "10px" }}
              >
                <Avatar
                  alt="Avatar"
                  src={values.avatar}
                  sx={{ width: 50, height: 50 }}
                />
                <UploadImageField
                  onImageUploaded={handleImageUploaded}
                  imageUrl={currentImageUrl}
                />
              </Box> 
                   <FormControl fullWidth variant="outlined">
                <InputLabel id="sex-label">Giới Tính</InputLabel>
                <Select
                  labelId="sex-label"
                  id="sex"
                  name="sex"
                  variant="outlined"
                  label="Giới Tinh"
                  value={values.sex}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.sex && errors.sex ? true : false}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nu">Nữ</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="area-label">Khu Vực</InputLabel>
                <Select
                  labelId="area-label"
                  id="area"
                  name="area"
                  va
                  variant="outlined"
                  label="Khu Vực"
                  value={values.area}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.area && errors.area ? true : false}
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="2">3</MenuItem>
                </Select>
              </FormControl>

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
                    variant="outlined"
                    onBlur={handleBlur}
                    error={touched.accountId && errors.accountId ? true : false}
                    helperText={touched.accountId && errors.accountId}
                  />
                )}
              />
         

              <TextField
                fullWidth
                variant="outlined"
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
                variant="outlined"
                type="phone"
                label="Số Điện Thoại"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={touched.phone && errors.phone ? true : false}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 1" }}
              />

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  
                  <TextField
                    fullWidth
                    label="Ngày Sinh"
                    variant="filled"
                    id="birthdate"
                    type="date"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.birthdate}
                    name="birthdate"
                    error={touched.birthdate && errors.birthdate ? true : false}
                    helperText={touched.birthdate && errors.birthdate}
                  />
                </Grid>
              </Grid>

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
                    {Object.keys(statusMapping).map((statusKey) => (
                      <MenuItem key={statusKey} value={statusKey}>
                        {statusMapping[statusKey]}{" "}
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

export default Addtechnician;