import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Divider,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CategoryIcon from "@mui/icons-material/Category";
import PlaceIcon from "@mui/icons-material/Place";
import PaymentIcon from "@mui/icons-material/Payment";
import SupportIcon from "@mui/icons-material/Support";
import HandymanIcon from "@mui/icons-material/Handyman";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
const MyModal = (props) => {
  const { openModal, setOpenModal, selectedEditOrder } = props;
  const [collapse, setCollapse] = useState(false);

  const handleClick = () => {
    setCollapse(!collapse);
  };
  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="book-detail-modal"
      aria-describedby="book-detail-modal-description"
      closeAfterTransition
    >
      <Fade in={openModal}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "80%",
              maxWidth: "800px",
              maxHeight: "90%",
              overflowY: "auto",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 5,
            }}
          >
            <IconButton
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
              onClick={() => setOpenModal(false)}
              aria-label="close"
            >
              <Close />
            </IconButton>

            <Typography variant="h4" component="h2" id="book-detail-modal">
            Thông Tin Chi Tiết Đơn Hàng Đang Điều Phối
            </Typography>

            {selectedEditOrder && (
       
              <Card>
                {/* <CardMedia
                  sx={{ height: "14.5625rem" }}
                  image="/images/cards/paper-boat.png"
                /> */}
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    id: {selectedEditOrder.id}
                  </Typography>
                  <Typography variant="body2">
                  customerId: {selectedEditOrder.customerId}
                  </Typography>     <Typography variant="body2">
                  managerId: {selectedEditOrder.managerId}
                  </Typography>     <Typography variant="body2">
                    customerNote: {selectedEditOrder.customerNote}
                  </Typography>
                  <Typography variant="body2">
                  cancellationReason: {selectedEditOrder.cancellationReason}
                  </Typography>

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
