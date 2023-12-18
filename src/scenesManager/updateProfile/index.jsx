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
import UploadImageField from "../../components/uploadImage";
import { editManager, editmanager } from "../../redux/managerSlice";

const UpdateProfileManager = () => {
  const dispatch = useDispatch();
  const rescueVehicleOwner = useSelector(
    (state) => state.rescueVehicleOwner.rescueVehicleOwners
  );
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(data.avatar || "");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [dataManager, setDataManager] = useState({});
  const [formattedDate, setFormattedDate] = useState('');
  const handleImageUploaded = (imageUrl) => {
    setDownloadUrl(imageUrl);
    // Set the avatar value to the uploaded image URL
    formikRef.current.setFieldValue("avatar", imageUrl);
  };
  // const convertDateFormat = (inputDate) => {
  //   // Tách ngày, tháng và năm từ chuỗi "mm/dd/yyyy"
  //   const [month, day, year] = inputDate.split('/');
  
  //   // Chuyển đổi thành định dạng "yyyy-MM-dd"
  //   const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  //   return formattedDate;
  // };
  
  const formatDate = (birthdate) => {
    // const formattedDate = convertDateFormat(birthdate);
    console.log(formattedDate)
    return formattedDate;
  };
  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const managerData = localStorage.getItem("manager");

    if (managerData) {
      const manager = JSON.parse(managerData);
      formatDate(manager.birthdate);
      console.log(manager.birthdate)
      setDataManager(manager);
    } else {
      console.log("Manager data not found");
    }
  }, []); 
  const statusMapping = {
    ACTIVE: "Hoạt Động",
    INACTIVE: "Không Hoạt Động",
  };
// Thêm mảng phụ thuộc rỗng để chỉ chạy một lần sau khi component mount

  useEffect(() => {
    if (Object.keys(dataManager).length > 0) {
      formikRef.current.setValues(dataManager);
    }
  }, [dataManager]);
  const checkoutSchema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ").required("Yêu cầu"),
    password: yup
      .string()
      .required("Yêu cầu")
      .min(8, "Mật khẩu cần dài ít nhất 8 ký tự")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt"
      ),
    fullname: yup.string().required("Yêu cầu"),
    sex: yup.string().required("Required"),
    status: yup.string().required("Required"),
    address: yup.string().required("Required"),
    phone: yup
      .string()
      .required("Yêu cầu")
      .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
    avatar: yup
      .string()
      .required("Yêu cầu")
      .test("is-avatar-provided", "Yêu cầu thêm avatar", function (value) {
        if (this.parent.avatar === "") {
          return this.createError({
            message: "Yêu cầu thêm avatar",
            path: "avatar",
          });
        }
        return true;
      }),
    birthdate: yup
      .date()
      .required("Yêu cầu")
      .max(new Date(), "Ngày sinh không được lớn hơn ngày hiện tại")
      .min(
        new Date(new Date().getFullYear() - 120, 0, 1),
        "Ngày sinh không hợp lệ"
      ),
    accountId: yup.string().required("Required"),
  });

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
    dispatch(editManager(values))
      .then((response) => {
        console.log(response);
        toast.success("Cập Nhật Tài Khoản Thành Công");

        // Đặt lại giá trị của formik về giá trị ban đầu (rỗng)
        formikRef.current.resetForm();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            `Lỗi khi cập nhật thông tin quản lí: ${error.response.data.message}`
          );
        } else {
          toast.error("Lỗi khi cập nhật thông tin quản lí");
        }
      });
  };
  const handleChange = (event) => {
    setFormattedDate(event.target.value);
    // You can also update the state 'apiDate' here if needed
  };
  useEffect(() => {
    dispatch(getAccountEmail())
      .then((response) => {
        // Kiểm tra trước khi truy cập 'data'
        if (response.payload && response.payload.data) {
          const data = response.payload.data;
          setData(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.dismiss("Error fetching account email:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <Box m="20px">
      <Header
        title="Cập Nhật Thông Tin Cá Nhân"
        subtitle="Cập Nhật Thông Tin Cá Nhân"
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
                Cập Nhật Thông Tin Cá Nhân
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
                label="Email"
                onBlur={handleBlur}
                value={values.account?.email}
                onChange={(e) => {
                  handleChange(e);
                }}
                name="email"
                error={touched.email && errors.email ? true : false}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 1" }}
              />
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
                {touched.avatar && errors.avatar && (
                  <Box
                    position="absolute"
                    bottom={-25}
                    left={0}
                    color="red"
                    fontSize="0.8rem"
                  >
                    {errors.avatar}
                  </Box>
                )}
              </Box>

              <FormControl fullWidth variant="filled">
                <InputLabel id="sex-label">Giới Tính</InputLabel>
                <Select
                  labelId="sex-label"
                  id="sex"
                  name="sex"
                  variant="outlined"
                  value={values.sex}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.sex && errors.sex ? true : false}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nu">Nữ</MenuItem>
                </Select>
              </FormControl>

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
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Ngày Sinh"
                onBlur={handleBlur}
                onChange={handleChange}
                value={  values.birthday}
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

export default UpdateProfileManager;
