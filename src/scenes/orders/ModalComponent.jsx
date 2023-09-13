import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { fetchProducts, getBookById } from '../../redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';

const MyModal = (props) => {
  const { openModal, setOpenModal, selectedOrderDetail } = props;
  const bookData = useSelector((state) => state.product.bookData); // Lấy bookData từ Redux Store
  const dispatch = useDispatch();
  const [bookInfo, setBookInfo] = useState({});
  useEffect(() => {
    if (selectedOrderDetail) {
      const bookIds = selectedOrderDetail.map(
        (orderDetail) => orderDetail.bookId
      );
      const uniqueBookIds = [...new Set(bookIds)]; // Loại bỏ các bookId trùng lặp

      uniqueBookIds.forEach((bookId) => {
        dispatch(getBookById({ id: bookId }))
          .then((data) => {
            console.log(data); // Kiểm tra xem dữ liệu sách đã được lấy về chưa
            setBookInfo((prevBookInfo) => ({
              ...prevBookInfo,
              [bookId]: data,
            }));
          })
          .catch((error) => console.error(error));
      });
    }
  }, [selectedOrderDetail, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts())
      .then(() => {
        // Không cần setFilteredordersStatus vì đã sử dụng useSelector để lấy danh sách sản phẩm
      })
      .catch((error) => {
        console.error('Failed to fetch products:', error);
        // Xử lý lỗi
      });
  }, [dispatch]);
  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="book-detail-modal"
      aria-describedby="book-detail-modal-description"
      closeAfterTransition>
      <Fade in={openModal}>
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
              onClick={() => setOpenModal(false)}
              aria-label="close">
              <Close />
            </IconButton>
            <Typography variant="h6" component="h2" id="book-detail-modal">
              Order Detail
            </Typography>
            {selectedOrderDetail && (
              <List>
                {' '}
                {selectedOrderDetail.map((orderDetail) => (
                  <ListItem key={orderDetail.ordersDetailId}>
                    {' '}
                    <ListItemText
                      primary={`Amount: ${orderDetail.amount}`}
                    />{' '}
                    {bookData && bookData.bookId === orderDetail.bookId && (
                      <div>
                        {' '}
                        <ListItemText primary="Thông tin sách" />{' '}
                        <ListItemText
                          primary={`Tên sách: ${bookData.authorName}`}
                        />{' '}
                        <ListItemText primary={`Tác giả: ${bookData.name}`} />{' '}
                        {/* Thêm các thông tin khác của sách */}{' '}
                      </div>
                    )}{' '}
                  </ListItem>
                ))}{' '}
              </List>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MyModal;
