import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { createGenres } from '../../redux/productSlice';
import { toast } from 'react-toastify';


const CreateBookGenres = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const isNonMobile = useMediaQuery('(min-width:600px)');


  const checkoutSchema = yup.object().shape({
    genres: yup.string().required('Required'),
  });

  const initialValues = {
    genres: '',
  };
  const handleFormSubmit = (values) => {
    dispatch(createGenres(values))
      .then((response) => {
        console.log(response);
        toast.success('Genres created successfully');
      })
      .catch((error) => {
        toast.error(error,"Error!!!");
      });
  };
  useEffect(() => {
    // Remove the following line
    // dispatch(createProduct())
  }, [dispatch]);
  return (
    <Box m="20px">
      <Header title="Create Genres" subtitle="Create a new Genres" />

      <Formik
        onSubmit={handleFormSubmit}
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
             <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Genres
              </Button>
            </Box>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Genres"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.genres}
                name="genres"
                error={!!touched.genres && !!errors.genres}
                helperText={touched.genres && errors.genres}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
           
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateBookGenres;