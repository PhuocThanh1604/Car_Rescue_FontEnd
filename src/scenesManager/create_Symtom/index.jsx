import React, {  useRef, useState } from "react";
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
import { createSymptom } from "../../redux/serviceSlice";

import AddIcon from "@mui/icons-material/Add";
const AddSymptom = () => {
  const dispatch = useDispatch();

  const service = useSelector((state) => state.service.services);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const checkoutSchema = yup.object().shape({
    symptom1: yup.string().required("Yêu cầu").matches(/^[\p{L}\s]+$/u, "Tên chỉ chứa ký tự chữ cái và khoảng trắng"),
   
  });

  const initialValues = {
    symptom1: ""
  };

  // Tạo ref để lưu trữ tham chiếu đến formik
  const formikRef = useRef(null);

  const handleFormSubmit = (values, { resetForm }) => {
    resetForm({ values: initialValues });
    // In ra tất cả dữ liệu đã nhập
    console.log("Dữ liệu đã nhập:", service);
    dispatch(createSymptom(values))
      .then((response) => {
        console.log(response);
        toast.success("Tạo Hiện Tượng Thành Công");
        // Đặt lại giá trị của formik về giá trị ban đầu (rỗng)
        formikRef.current.resetForm();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(
            `Lỗi khi tạo chủ tạo hiện tượng: ${error.response.data.message}`
          );
        } else {
          toast.error("Lỗi khi lỗi khi tạo hiện tượng vui lòng thử lại");
        }
      });
  };
  return (
    <Box m="20px">
      <Header title="Tạo Hiện Tượng" subtitle="Tạo Thông Tin Chi Tiết Hiện Tượng" />

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
             <AddIcon/>   Tạo Hiện Tượng
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
                label="Tên Hiện Tượng"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.symptom1}
                name="symptom1"
                error={touched.symptom1 && errors.symptom1 ? true : false}
                helperText={touched.symptom1 && errors.symptom1}
                sx={{ gridColumn: "span 1" }}
              />
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddSymptom;
