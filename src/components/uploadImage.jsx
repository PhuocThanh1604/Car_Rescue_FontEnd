import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { storage } from "../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const UploadImageField = ({ onImageUploaded, imageUrl }) => {
  const [imageUpload, setImageUpload] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(""); // State to store the download URL

  const uploadImage = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `admin/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload)
      .then(() => {
        alert("Image uploaded successfully");
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
        console.error("Error while uploading image:", error);
      });
  };

  useEffect(() => {
    if (imageUpload) {
      uploadImage(); // Initiate the upload when the file input changes
    }
  }, [imageUpload]);

  return (
    <div>
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
    </div>
  );
};

export default UploadImageField;
