import React, { useRef } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAccount } from "../../redux/accountSlice";

const CreateAccount = () => {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.account.accounts);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  //Check value input field
  const checkoutSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Required"),
    password: yup.string().required("Required"),
    date: yup.date().required("Required"), // Date validation
  });
  //Bien khoi tao
  const initialValues = {
    email: "",
    password: "",
    date: "",
  };

  // Tạo ref để lưu trữ tham chiếu đến formik
  const formikRef = useRef(null);

  //Function create a account 
  const handleFormSubmit = (values) => {
    dispatch(createAccount(values))
      .then((response) => {
        console.log(response);
        toast.success("Tạo Tài Khoản Thành Công");

        // Đặt lại giá trị của formik về giá trị ban đầu (rỗng)
        formikRef.current.resetForm();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(`Lỗi khi tạo tài khoản: ${error.response.data.message}`);
        } else {
          toast.error("Lỗi khi tạo tài khoản.");
        }
      });
  };

  return (
    <Box m="20px">
      <Header title="Tạo Tài Khoản" subtitle="Danh sách khách hàng" />

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
                Tạo Tài Khoản
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
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={touched.email && errors.email ? true : false}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={touched.password && errors.password ? true : false}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.date}
                name="date"
                error={touched.date && errors.date ? true : false}
                helperText={touched.date && errors.date}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateAccount;
