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
  Tooltip,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createRescueVehicleOwner } from "../../../redux/rescueVehicleOwnerSlice";
import AddIcon from "@mui/icons-material/Add";
import { getAccountEmail } from "../../../redux/accountSlice";
import UploadImageField from "../../../components/uploadImage";
import { v4 as uuidv4 } from "uuid";
import InfoIcon from "@mui/icons-material/Info";
import areaData from "../../../data.json";
const AddRescueVehicleOwner = () => {
  const dispatch = useDispatch();
  const rescueVehicleOwner = useSelector(
    (state) => state.rescueVehicleOwner.rescueVehicleOwners
  );
  const uui = uuidv4();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(data.avatar || "");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dataJson, setDataJson] = useState([]);
  useEffect(() => {
    if (dataJson.area && dataJson.area.length > 0) {
      console.log(dataJson.area[0].name || "Không có ");
    } else {
      console.log("Không có dữ liệu về khu vực");
    }
    setDataJson(areaData);
  }, [dataJson]);
  const handleImageUploaded = (imageUrl) => {
    setDownloadUrl(imageUrl);
    // Set the avatar value to the uploaded image URL
    formikRef.current.setFieldValue("avatar", imageUrl);
  };
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
    fullname: yup.string().required("Yêu cầu").matches(/^[\p{L}\s]+$/u, "Tên chỉ chứa ký tự chữ cái và khoảng trắng"),
    sex: yup.string().required("Yêu cầu"),
    status: yup.string().required("Yêu cầu"),
    address: yup.string().required("Yêu cầu"),
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
    createAt: yup.date().required("Yêu cầu"), // Date validation
    accountId: yup.string().required("Yêu cầu"),
    area: yup.string().required("Yêu cầu"),
  });
  const statusMapping = {
    ACTIVE: "Hoạt Động",
    INACTIVE: "Không Hoạt Động",
  
  };
  const initialValues = {
    fullname: "",
    sex: "",
    status: "",
    birthdate: "",
    address: "",
    phone: "",
    avatar: "",
    accountId: uui,
    createAt: new Date(),
    area: "",
  };


  const formikRef = useRef(null);

 
  const handleFormSubmit = (values, { resetForm }) => {
    const { email, password, ...restValues } = values;
    const updatedInitialValues = {
      ...restValues,
      account: {
        id: uui,
        createAt: new Date(),
        email: email,
        password: password,
        deviceToken: "",
      },
    };

    resetForm({
      values: updatedInitialValues,
      values2: initialValues,
    });

    if (values.avatar) {
      URL.revokeObjectURL(values.avatar);
    }
    // In ra tất cả dữ liệu đã nhập
    console.log("Dữ liệu đã nhập:", updatedInitialValues);
    dispatch(createRescueVehicleOwner(updatedInitialValues))
      .then((response) => {
        if (response.payload.status === "Success") {
          toast.success("Tạo Tài Khoản Thành Công");

          resetForm();
          formikRef.current.resetForm();
          formikRef.current.setFieldValue("email", "");
          formikRef.current.setFieldValue("password", "");
          formikRef.current.setValues(initialValues);
        }  else if (response.payload.status === "Fail") {
          toast.error("Email đã tồn tại vui lòng thử lại");
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
      <Header title="Tạo Thông Tin" subtitle="Tạo Thông Tin Chủ Xe Cứu Hộ" />

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
                <AddIcon /> Tạo Chủ Xe Cứu Hộ
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
                value={values.email}
                onChange={(e) => {
                  handleChange(e);
                  setEmail(e.target.value);
                }}
                name="email" // Tên trường trong initialValues
                error={touched.email && errors.email ? true : false}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="password"
                label="Password"
                onBlur={handleBlur}
                value={values.password}
                onChange={(e) => {
                  handleChange(e);
                  setPassword(e.target.value);
                }}
                name="password" // Tên trường trong initialValues
                error={touched.password && errors.password ? true : false}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
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

              <FormControl fullWidth variant="outlined">
                <InputLabel id="sex-label">Giới Tính</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  label="Trạng Thái"
                  variant="outlined"
                  id="sex"
                  name="sex"
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
                sx={{ gridColumn: "span 1" }}
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
                sx={{ gridColumn: "span 1" }}
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

export default AddRescueVehicleOwner;
