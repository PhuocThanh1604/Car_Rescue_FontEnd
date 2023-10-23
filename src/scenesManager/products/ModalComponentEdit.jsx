import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { editProduct } from '../../redux/productSlice';
import { ToastContainer, toast } from 'react-toastify';
import { getGenres, getGenresId } from '../../redux/genreSlice';
const ModalEdit = ({ openEditModal, setOpenEditModal, selectedEditBook }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [editBook, setEditBook] = useState({});
  const genres = useSelector((state) => state.product.genres);
  const [genreNames, setGenreNames] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [tempSelectedGenre, setTempSelectedGenre] = useState('');
  const uniqueGenreNames = [...new Set(genreNames)];
  const [filteredGenreNames, setFilteredGenreNames] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [initialFormState, setInitialFormState] = useState({});

  useEffect(() => {
    if (selectedEditBook) {
      const bookToEdit = products.find(
        (product) => product.bookId === selectedEditBook.bookId
      );
      if (bookToEdit) {
        setEditBook(bookToEdit);
        setInitialFormState(bookToEdit);
      }
    }
  }, [selectedEditBook, products]);
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
    const genreNames = genres?.map((genreName) => genreName) || [];
    const filteredNames = [...new Set(genreNames)];
    setFilteredGenreNames(filteredNames);
  }, [genres]);

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   console.log(value);
  //   if (name === 'bookImages') {
  //     setEditBook((prevBook) => {
  //       const updatedBookImages = prevBook.bookImages.map((image, index) => {
  //         if (index === 0) {
  //           // Lưu bookImageId của phần tử đầu tiên
  //           const bookImageId = image.bookImageId;
  //           console.log(bookImageId);
  //           // Chỉnh sửa URL của phần tử đầu tiên
  //           return { bookImageId, url: value };
  //         }
  //         return image;
  //       });
  //       return {
  //         ...prevBook,
  //         bookImages: updatedBookImages,
  //       };
  //     });
  //   } else {
  //     setEditBook((prevBook) => ({
  //       ...prevBook,
  //       [name]: value,
  //     }));
  //   }
  // };

  useEffect(() => {
    if (isSuccess) {
      // Thực hiện các hành động sau khi chỉnh sửa thành công
      toast.success('Edit book successfully');
      handleClose(); // Đóng modal sau khi lưu thành công
    }
  }, [isSuccess]);
  const handleGenreChange = (event) => {
       console.log('genreId:', selectedGenre.genreId);
    console.log('genreName:', value);
    const { value } = event.target;
    const selectedGenre = genres.find((genre) => genre.genreName === value);

    if (selectedGenre) {
      setSelectedGenre(value);
      setTempSelectedGenre(value);
      setSelectedGenres([selectedGenre]);

      setEditBook((prevBook) => ({
        ...prevBook,
        genres: [
          {
            genreId: selectedGenre.genreId,
            genreName: value,
          },
        ],
      }));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log('genreId:', selectedGenre.genreId);
    console.log('genreName:', value);

    if (name === 'bookImages') {
      setEditBook((prevBook) => {
        const updatedBookImages = prevBook.bookImages.map((image, index) => {
          if (index === 0) {
            // Chỉnh sửa URL của phần tử đầu tiên
            return { ...image, url: value };
          }
          return image;
        });
        return {
          ...prevBook,
          bookImages: updatedBookImages,
        };
      });
    } else if (name === 'genres[0].genreName') {
      const selectedGenre = genres.find((genreName) => genreName === value);

      if (selectedGenre) {
        setEditBook((prevBook) => ({
          ...prevBook,
          genres: [
            {
              // genreId: selectedGenre.genreId,
              genreName: selectedGenre,
            },
          ],
        }));
      }
    } else {
      setEditBook((prevBook) => ({
        ...prevBook,
        [name]: value,
      }));
    }
  };

  const handleSaveClick = () => {
    if (!isValidUrl(editBook.bookImages[0].url)) {
      toast.error('Invalid URL');
      return;
    }

    if (JSON.stringify(initialFormState) === JSON.stringify(editBook)) {
      toast.info('No changes to save');
      handleClose();
      return;
    }
    // Tạo một mảng genres mới từ selectedGenres
    const updatedGenres = selectedGenres.map((genre) => ({
      genreName: genre.genreName,
      genreId: genre.genreId,
    }));
    // Cập nhật editBook với mảng genres mới
    setEditBook((prevBook) => ({
      ...prevBook,
      genres: updatedGenres,
    }));
    dispatch(editProduct({ id: selectedEditBook.bookId, data: editBook }))
      .then(() => {
        setIsSuccess(true); // Đánh dấu chỉnh sửa thành công
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleClose = () => {
    setOpenEditModal(false);
  };

  if (!products) {
    // Thêm điều kiện kiểm tra nếu products không có giá trị
    return null;
  }
  // Hàm kiểm tra URL hợp lệ
  const isValidUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  return (
    <>
      <ToastContainer />
      <Modal
        open={openEditModal}
        onClose={handleClose}
        aria-labelledby="book-detail-modal"
        aria-describedby="book-detail-modal-description"
        closeAfterTransition>
        <Fade in={openEditModal}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}>
            <Box
              sx={{
                position: 'relative',
                width: '80%',
                maxWidth: '800px',
                maxHeight: '90%',
                overflowY: 'auto',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 5,
              }}>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                }}
                aria-label="close"
                onClick={handleClose}>
                <Close />
              </IconButton>
              <Typography variant="h6" component="h2" id="book-detail-modal">
                {selectedEditBook ? 'Edit Book' : 'Book Detail'}
              </Typography>

              {selectedEditBook && (
                <Card>
                  <CardContent>
                    <TextField
                      name="authorName"
                      label="Author"
                      value={editBook.authorName || ''}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="publisherName"
                      label="Publisher"
                      value={editBook.publisherName || ''}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="bookImages"
                      label="Link Image"
                      value={
                        editBook.bookImages && editBook.bookImages.length > 0
                          ? editBook.bookImages[0].url
                          : ''
                      }
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="name"
                      label="Name"
                      value={editBook.name || ''}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="quantity"
                      label="Quantity"
                      type="number"
                      value={editBook.quantity || ''}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="pageNumber"
                      label="Page Number"
                      type="number"
                      value={editBook.pageNumber || ''}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="price"
                      label="Price"
                      type="number"
                      value={editBook.price || ''}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="description"
                      label="Description"
                      value={editBook.description || ''}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    />

                    {/* <TextField
                      name="genres"
                      label="Genres"
                      value={
                        editBook.genres && editBook.genres.length > 0
                          ? editBook.genres[0]?.genreName
                          : ''
                      }
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                    /> */}
                    <FormControl fullWidth variant="filled">
                      <InputLabel id="genre-select-label">Genre</InputLabel>
                      <Select
                        labelId="genre-select-label"
                        id="genre-select"
                        value={
                          editBook.genres && editBook.genres.length > 0
                            ? editBook.genres[0]?.genreName
                            : ''
                        }
                        name="genres[0].genreName"
                        onChange={handleInputChange}>
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
                    {/* <FormControl fullWidth variant="filled">
                      <InputLabel id="genre-select-label">Genre</InputLabel>
                      <Select
                        labelId="genre-select-label"
                        id="genre-select"
                        value={
                          editBook.genres && editBook.genres.length > 0
                            ? editBook.genres[0]?.genreName
                            : ''
                        }
                        name="genres[0].genreName"
                        onChange={handleInputChange}>
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
                    </FormControl> */}

                    <FormControl fullWidth sx={{ marginTop: 1 }}>
                      <InputLabel id="demo-simple-select-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={editBook.status || ''}
                        onChange={handleInputChange}
                        variant="outlined"
                        className="filter-select"
                        name="status"
                        label="Status">
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
                  </CardContent>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      onClick={handleSaveClick}
                      variant="contained"
                      color="primary">
                      Save
                    </Button>
                  </Box>
                </Card>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ModalEdit;
