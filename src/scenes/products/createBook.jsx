import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Select,
  TextField,
  useMediaQuery,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../redux/productSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Header';
import { getGenres } from '../../redux/productSlice';
// import { useField } from 'formik';

const CreateBook = () => {
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.product.genres);
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const [genreNames, setGenreNames] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [tempSelectedGenre, setTempSelectedGenre] = useState('');
  const uniqueGenreNames = [...new Set(genreNames)];
  const [filteredGenreNames, setFilteredGenreNames] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const checkoutSchema = yup.object().shape({
    authorName: yup.string().required('required'),
    description: yup.string().required('required'),
    quantity: yup.number().required('required'),
    publicDate: yup.string().required('required'),
    price: yup.number().required('required'),
    pageNumber: yup.number().required('required'),
    status: yup.string().required('required'),
    name: yup.string().required('required'),
    genres: yup
      .array()
      .of(
        yup.object().shape({
          genreName: yup.string().required('required'),
        })
      )
      .required('required'),
    bookImages: yup
      .array()
      .of(
        yup.object().shape({
          url: yup.string().required('required'),
        })
      )
      .required('required'),
  });

  const initialValues = {
    authorName: '',
    description: '',
    quantity: 0,
    publicDate: '',
    price: 0,
    pageNumber: 0,
    publisherName: '',
    status: '',
    name: '',
    genres: [{ genreName: '' }],
    bookImages: [{ url: '' }],
  };
  const handleFormSubmit = (values, { resetForm }) => {
    const product = {
      ...values,
      genres: [{ genreName: selectedGenre }],
      bookImages: [{ url: values.bookImages[0]?.url }],
    };
    console.log(product);
    dispatch(createProduct(product))
    .unwrap()
    .then(() => {
      toast.success('Product created successfully');
      setIsSuccess(true);
    })
    .catch((error) => {
      toast.error(error, 'Error!!! You can check again!!');
    });
    resetForm({ values: initialValues });
  };
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        await dispatch(getGenres());
      } catch (error) {
        toast.error(error);
      }
    };
    fetchGenres();
  }, [dispatch]);


  useEffect(() => {
    const genreNames = genres?.map((genreName) =>genreName) || [];
    const filteredNames = [...new Set(genreNames)];
    setFilteredGenreNames(filteredNames);
  }, [genres]);
  
  
  const CustomError = ({ touched, error }) => {
    if (touched && error) {
      return <div style={{ color: 'red' }}>{error}</div>;
    }
    return null;
  };

  return (
    <Box m="20px">
      <Header title="ADD BOOK" subtitle="Create a new book " />
      <ToastContainer />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        loading={loading}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="flex" justifyContent="end" mt="20px" mb="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Book
              </Button>
            </Box>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
              }}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Author Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.authorName}
                name="authorName"
                error={!!touched.authorName && !!errors.authorName}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="PublisherName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.publisherName}
                name="publisherName"
                error={!!touched.publisherName && !!errors.publisherName}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Link Image"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bookImages[0]?.url}
                name="bookImages[0].url"
                error={
                  !!touched.bookImages?.[0]?.url &&
                  !!errors.bookImages?.[0]?.url
                }
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="PublicDate"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.publicDate}
                name="publicDate"
                error={!!touched.publicDate && !!errors.publicDate}
                InputProps={{
                  readOnly: false, // Chặn chỉnh sửa trường ngày
                }}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.quantity}
                name="quantity"
                error={!!touched.quantity && !!errors.quantity}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="PageNumber"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.pageNumber}
                name="pageNumber"
                error={!!touched.pageNumber && !!errors.pageNumber}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                sx={{ gridColumn: 'span 2' }}
              />
              <FormControl fullWidth variant="filled">
                <InputLabel id="genre-select-label">Genre</InputLabel>
                <Select
                  labelId="genre-select-label"
                  id="genre-select"
                  value={values.genres[0]?.genreName}
                  name="genres[0].genreName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    !!touched.genres?.[0]?.genreName &&
                    !!errors.genres?.[0]?.genreName
                  }>
                  {filteredGenreNames && filteredGenreNames.length > 0 ? (
                    filteredGenreNames.map((genreName, index) => (
                      <MenuItem key={index} value={genreName}>
                        {genreName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No genres available</MenuItem>
                  )}
                </Select>
              </FormControl>

              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Status"
                    variant="outlined"
                    className="filter-select"
                    name="status"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.status && !!errors.status}
                    sx={{ gridColumn: 'span 4' }}>
                    <MenuItem key="status-active" value="Active">
                      Active
                    </MenuItem>
                    <MenuItem key="status-outofstock" value="Out of stock">
                      Out of Stock
                    </MenuItem>
                    <MenuItem key="status-unavailable" value="unavailable">
                      Unavailable
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <CustomError
                touched={touched.authorName}
                error={errors.authorName}
              />
              {/* <input
                type="file"
                multiple
                onChange={(event) => {
                  const files = event.target.files;
                  setFieldValue('images', files);
                }}
              /> */}
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateBook;
