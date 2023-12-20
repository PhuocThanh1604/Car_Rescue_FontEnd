import React, {  useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
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
import { createService } from "../../redux/serviceSlice";
import { fetchManagers } from "../../redux/managerSlice";
import AddIcon from "@mui/icons-material/Add";
const AddService = () => {
  const dispatch = useDispatch();

  const service = useSelector((state) => state.service.services);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [selectedManager, setSelectedManager] = useState(null);
  const [dataSelect, setDataSelect] = useState([]);
  const [loading, setLoading] = useState(false);
  // Lấy đối tượng manager từ localStorage
  const managerString = localStorage.getItem("manager");
  let manager = null;
  
  if (managerString) {
    try {
      manager = JSON.parse(managerString); // Thử phân tích chuỗi JSON
    } catch (error) {
      console.error("Lỗi khi phân tích chuỗi JSON:", error);
    }
  }
  
  const checkoutSchema = yup.object().shape({
    name: yup.string().required("Yêu Cầu"),
    description: yup.string(),
    status: yup.string().required("Yêu Cầu"),
    price: yup
    .number()
    .required("Yêu Cầu")
    .positive("Price must be a positive number")
    .min(1000, "Gía tiền phải lớn hơn hoặc bằng 1.000 VNĐ"),
    type: yup.string().required("Yêu Cầu"),
    createdBy: yup.string().required("Yêu Cầu"),
  });
  const statusMapping = {
    ACTIVE: "Hoạt Động",
    INACTIVE: "Không Hoạt Động",
  };
  const initialValues = {
    name: "",
    price: 0,
    description: "",
    status: "",
    type: "",
    createdBy: "",
  };

  // Tạo ref để lưu trữ tham chiếu đến formik
  const formikRef = useRef(null);

  const handleFormSubmit = (values, { resetForm }) => {
    resetForm({ values: initialValues });
    // In ra tất cả dữ liệu đã nhập
    dispatch(createService(values))
      .then((response) => {
        toast.success("Tạo Dịch Vụ Thành Công");
        // Đặt lại giá trị của formik về giá trị ban đầu (rỗng)
        formikRef.current.resetForm();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            `Lỗi khi tạo chủ tạo dịch vụ: ${error.response.data.message}`
          );
        } else {
          toast.error("Lỗi khi lỗi khi tạo dịch vụ");
        }
      });
  };
  return (
    <Box m="20px">
      <Header title="Tạo Dịch Vụ" subtitle="Tạo Thông Tin Dịch Vụ" />

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
             <AddIcon/>   Tạo Dịch Vụ
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
                label="Tên Dịch Vụ"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={touched.name && errors.name ? true : false}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Mô Tả Dịch Vụ"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={touched.description && errors.description ? true : false}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                label="Giá Dịch Vụ"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={touched.price && errors.price ? true : false}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Id Của Manager"
                onBlur={handleBlur}
                onChange={handleChange}
                value={(values.createdBy = manager.id)}
                name="createdBy"
                error={touched.createdBy && errors.createdBy ? true : false}
                helperText={touched.createdBy && errors.createdBy}
                sx={{ gridColumn: "span 1" }}
                style={{ display: "none" }}
              />
              <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label">Loại Dịch Vụ</InputLabel>
                <Select
                  labelId="demo-simple-select-label"

                  variant="outlined"
                  label="Loại Dịch Vụ"
                  id="type"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.type && errors.type ? true : false}
                >
                  <MenuItem value="Fixing">Fixing</MenuItem>
                  <MenuItem value="Towing">Towing</MenuItem>
                </Select>
              </FormControl>

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

export default AddService;
