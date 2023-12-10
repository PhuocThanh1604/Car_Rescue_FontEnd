import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { styled } from '@mui/material/styles';
import { Box, Button, Input } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
const UploadImageField = ({ onImageUploaded, imageUrl }) => {
  const [imageUpload, setImageUpload] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(""); // State to store the download URL
  const StyledInput = styled(Input)({
    display:"none",
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
    
  });
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const uploadImage = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `admin/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload)
      .then(() => {
        alert("Hình ảnh đã cập nhật thành công!!");
        // Get the download URL and set it in the state
        return getDownloadURL(imageRef);
      })
      .then((url) => {
        setDownloadUrl(url);
        // Call a callback function (if needed) to notify the parent component about the URL
        if (onImageUploaded) {
          onImageUploaded(url);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật ảnh:", error);
      });
  };

  useEffect(() => {
    if (imageUpload) {
      uploadImage(); // Initiate the upload when the file input changes
    }
  }, [imageUpload]);

  return (
    <Box sx={{marginLeft:"6px"}}>
    <label htmlFor="upload-button">
      
      <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
        Tải ảnh lên
        <StyledInput
        id="upload-button"
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      </Button>
    </label>
  </Box>
  );
};

export default UploadImageField;
