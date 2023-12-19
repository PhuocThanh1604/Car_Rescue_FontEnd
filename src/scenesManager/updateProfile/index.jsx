import React, { useEffect, useRef, useState } from "react";
import {
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
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAccountEmail } from "../../redux/accountSlice";
import UploadImageField from "../../components/uploadImage";
import { editManager } from "../../redux/managerSlice";
import InfoIcon from "@mui/icons-material/Info";
import areaData from "../../data.json";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
const UpdateProfileManager = () => {
  const dispatch = useDispatch();
  const rescueVehicleOwner = useSelector(
    (state) => state.rescueVehicleOwner.rescueVehicleOwners
  );
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(data.avatar || "");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [dataManager, setDataManager] = useState({});
  const checkoutSchema = yup.object().shape({
    fullname: yup
      .string()
      .matches(/^[\p{L}\s]+$/u, "Tên chỉ chứa ký tự chữ cái và khoảng trắng"),
    address: yup.string().required("Required"),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
    birthdate: yup
      .date()
      .max(new Date(), "Ngày sinh không được lớn hơn ngày hiện tại")
      .min(
        new Date(new Date().getFullYear() - 120, 0, 1),
        "Ngày sinh không hợp lệ"
      ),
  });

  const initialValues = {
    fullname: "",
    sex: "",
    status: "",
    birthdate: "",
    address: "",
    phone: "",
    avatar: "",
  };

  const formikRef = useRef({});
  const handleImageUploaded = (imageUrl) => {
    setDownloadUrl(imageUrl);
    formikRef.current.setFieldValue("avatar", imageUrl);
  };
  const [dataJson, setDataJson] = useState([]);
  useEffect(() => {
    if (dataJson.area && dataJson.area.length > 0) {
      console.log(dataJson.area[0].name || "Không có ");
    } else {
      console.log("Không có dữ liệu về khu vực");
    }
    setDataJson(areaData);
  }, [dataJson]);
  const formatDateForClient = (birthdate) => {
    const formattedDate = moment(birthdate)
      .tz("Asia/Ho_Chi_Minh")
      .add(7, "hours")
      .startOf("day")
      .format("YYYY-MM-DD"); // Adjust the date format as per your requirement
    return formattedDate;
  };
  useEffect(() => {
    const managerData = localStorage.getItem("manager");
    if (managerData) {
      const manager = JSON.parse(managerData);
      const formattedBirthdate = formatDateForClient(manager.birthdate);
      setDataManager({ ...manager, birthdate: formattedBirthdate });
    } else {
      console.log("Manager data not found");
    }
  }, []);

  const handleSaveClick = (values) => {
    setLoading(true);
    if (!values) {
      toast.error("Không có thông tin để cập nhật");
      setLoading(false);
      return;
    }
    const hasChanges = JSON.stringify(values) !== JSON.stringify(initialValues);

    if (!hasChanges) {
      toast.info("Không có thay đổi để lưu.");
      setLoading(false);
    } else {
      dispatch(editManager(values))
        .then((res) => {
          console.log();
          if (res.payload.status === "Success") {
            toast.success("Cập nhật thành công.");
            localStorage.setItem("manager", JSON.stringify(values));
            setLoading(false);
          } else {
            toast.error("Cập nhật không thành công.");
            localStorage.setItem("manager", JSON.stringify(values));
            setLoading(false);
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(
              `Lỗi khi cập nhật thông tin: ${error.response.data.message}`
            );
          } else {
            toast.error("Lỗi khi cập nhật thông tin.");
          }
        }).finally(() => {
          setLoading(false); 
        });
    }
  };

  useEffect(() => {
    if (Object.keys(dataManager).length > 0) {
      formikRef.current.setValues(dataManager);
    }
  }, [dataManager]);

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
      {/* <div>
        {loading ? (
          <CircularProgress />
        ) : ( */}
      <Formik
        onSubmit={handleSaveClick}
        innerRef={formikRef}
        loading={loading}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
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
                Chỉnh sửa thông tin
              </Button>
            </Box>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
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
                sx={{ gridColumn: "span 2" }}
                disabled
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel id="area-label">Khu Vực</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="area"
                  name="area"
                  variant="outlined"
                  value={values.area || ""}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Khu vực"
                  disabled // Thêm thuộc tính disabled ở đây
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
                            style={{
                              marginLeft: "5px",
                              fontSize: "16px",
                            }}
                          />
                        </Tooltip>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

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
                onChange={(event) => {
                  const value = event.target.value;
                  setDataManager({ ...dataManager, birthdate: value });
                  // Thêm logic xử lý khi người dùng thay đổi ngày sinh ở đây (nếu cần)
                }}
                value={dataManager.birthdate || ""}
                name="birthdate"
                error={touched.birthdate && errors.birthdate ? true : false}
                helperText={touched.birthdate && errors.birthdate}
                sx={{ gridColumn: "span 1" }}
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
                sx={{ gridColumn: "span 1" }}
              />
            </Box>
          </form>
        )}
      </Formik>
      {/* )}
      </div> */}
    </Box>
  );
};

export default UpdateProfileManager;
