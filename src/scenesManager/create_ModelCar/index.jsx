import React, { useEffect, useRef, useState } from "react";
import {
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
import AddIcon from "@mui/icons-material/Add";
import { fetchManagers } from "../../redux/managerSlice";
import { createModelCar } from "../../redux/modelCarSlice";

const AddModelCar = () => {
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
    model1: yup.string().required("Required"),
    status: yup.string().required("Required"),
  });
  const statusMapping = {
    ACTIVE: "Hoạt Động",
    INACTIVE: "Không Hoạt Động",
  };
  const initialValues = {
    model1: "",
    status: "",
  };

  // Tạo ref để lưu trữ tham chiếu đến formik
  const formikRef = useRef(null);

  const handleFormSubmit = (values, { resetForm }) => {
    resetForm({ values: initialValues });
    // In ra tất cả dữ liệu đã nhập
    console.log("Dữ liệu đã nhập:", values);
    dispatch(createModelCar(values))
      .then((response) => {
          console.log(response);
          toast.success("Tạo Mẫu Xe Thành Công");
          // Đặt lại giá trị của formik về giá trị ban đầu (rỗng)
          formikRef.current.resetForm();
  

      
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            `Lỗi khi tạo hãng xe: ${error.response.data.message}`
          );
        } else {
          toast.error("Lỗi khi lỗi khi tạo mẫu xe xe");
        }
      });
  };
  useEffect(() => {
    dispatch(fetchManagers())
      .then((response) => {
        const data = response.payload.data;

        if (data) {
          setDataSelect(data);
          setLoading(false);
        }else{
          toast.dismiss("không có dữ liệu trả về")
        }
      }).catch(error => {
        // Xử lý lỗi ở đây
        console.error("Lỗi khi lấy dữ liệu báo cáo:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);
  return (
    <Box m="20px">
      <Header title="Tạo Mẫu Xe" subtitle="Tạo Thông Tin Mẫu Xe" />

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
              <AddIcon />  Tạo Hãng Xe
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
                label="Tên Hãng Xe"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.model1}
                name="model1"
                error={touched.model1 && errors.model1 ? true : false}
                helperText={touched.model1 && errors.model1}
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
                    sx={{ gridColumn: "span 1" }}
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

export default AddModelCar;
