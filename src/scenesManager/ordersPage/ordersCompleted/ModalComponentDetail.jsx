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

            <Typography variant="h6" component="h2" id="book-detail-modal">
              Chi tiết đơn hàng
            </Typography>

            {selectedEditOrder && (
              // <Card>
              //   <CardContent>
              //     <Typography variant="body1" component="p">
              //     id: {selectedEditOrder.id}
              //     </Typography>
              //     <Typography variant="body1" component="p">
              //       customerNote: {selectedEditOrder.customerNote}
              //     </Typography>
              //     <Typography variant="body1" component="p">
              //       PageNumber: {selectedEditOrder.pageNumber}
              //     </Typography>

              //     {/* Thêm thông tin chi tiết sách khác ở đây */}
              //   </CardContent>
              // </Card>
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
                    customerNote: {selectedEditOrder.customerNote}
                  </Typography>
                </CardContent>
                <CardActions className="card-action-dense">
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button onClick={handleClick}>Details</Button>
                    <IconButton size="small" onClick={handleClick}>
                      {collapse ? (
                        <ExpandLessIcon sx={{ fontSize: "1.875rem" }} />
                      ) : (
                        <ExpandMoreIcon sx={{ fontSize: "1.875rem" }} />
                      )}
                    </IconButton>
                  </Box>
                </CardActions>
                <Collapse in={collapse}>
                  <Divider sx={{ margin: 0 }} />
                  <CardContent>
                    <Typography variant="h4" sx={{ marginBottom: 2 }}>
                      Thông Tin Chi Tiết Đơn Hàng
                    </Typography>
             
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          mr: 2,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          alt="Mary Vaughn"
                          src="https://thumbs.dreamstime.com/b/businessman-icon-vector-male-avatar-profile-image-profile-businessman-icon-vector-male-avatar-profile-image-182095609.jpg"
                          sx={{
                            width: 44,
                            height: 44,
                            marginRight: 2.75,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center", // Căn chỉnh theo chiều dọc
                          }}
                        >
                          Mary Vaughn
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body1"
                      component="p"
                      sx={{
                        display: "flex",
                        alignItems: "center", // Căn chỉnh theo chiều dọc
                        marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                      }}
                    >
                      <CategoryIcon /> <strong>Rescue Type:</strong>{" "}
                      <Box
                        width="30%"
                        ml="4px"
                        p="2px"
                        display="flex"
                        justifyContent="center"
                        fontSize={10}
                        borderRadius={8}
                        backgroundColor={
                          selectedEditOrder.rescueType === "Fixing"
                            ? "green"
                            : selectedEditOrder.rescueType === "Towing"
                            ? "red"
                            : "grey"
                        }
                      >
                        {selectedEditOrder.rescueType === "Towing" && <SupportIcon />}
                        {selectedEditOrder.rescueType === "Fixing" && <HandymanIcon />}
                        <Typography color="white">{selectedEditOrder.rescueType}</Typography>
                      </Box>
                    </Typography>
                    <Typography
                      variant="body1"
                      component="p"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                      }}
                    >
                      <QueryBuilderIcon /> <strong>Date:</strong>{" "}
                      {selectedEditOrder.createdAt}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="p"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                      }}
                    >
                      <PlaceIcon /> <strong>Departure:</strong> {selectedEditOrder.departure}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="p"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                      }}
                    >
                      <PlaceIcon /> <strong>Destination:</strong>{" "}
                      {selectedEditOrder.destination}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="p"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px", // Thêm khoảng cách dưới cùng của dòng
                      }}
                    >
                      <PaymentIcon /> <strong>Payment ID:</strong>{" "}
                      {selectedEditOrder.paymentId}
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default MyModal;
