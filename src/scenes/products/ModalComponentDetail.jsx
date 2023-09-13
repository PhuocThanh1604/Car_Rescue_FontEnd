import React from 'react';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const MyModal = (props) => {
  const { openModal, setOpenModal, selectedBook } = props;

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
              Book Detail
            </Typography>

            {selectedBook && (
              <Card>
                {selectedBook.bookImages.length > 0 && (
                  <Slider>
                    {selectedBook.bookImages.map((image) => (
                      <CardMedia
                        key={image.bookImageId}
                        component="img"
                        height="300"
                        image={image.url}
                        alt={selectedBook.name}
                      />
                    ))}
                  </Slider>
                )}
                <CardContent>
                  <Typography variant="body1" component="p">
                    Author: {selectedBook.authorName}
                  </Typography>
                  <Typography variant="body1" component="p">
                    Author: {selectedBook.publisherName}
                  </Typography>
                  <Typography variant="body1" component="p">
                    PageNumber: {selectedBook.pageNumber}
                  </Typography>
                  <Typography variant="body1" component="p">
                    Description: {selectedBook.description}
                  </Typography>
                  <Typography variant="body1" component="p">
                    Genres:{' '}
                    {selectedBook && selectedBook.genres.length > 0
                      ? selectedBook.genres[0].genreName
                      : ''}
                  </Typography>
                  {/* Thêm thông tin chi tiết sách khác ở đây */}
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MyModal;
