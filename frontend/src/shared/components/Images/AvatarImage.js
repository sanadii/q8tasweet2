/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { api } from "config";

const mediaUrl = api?.MEDIA_URL?.endsWith('/') ? api.MEDIA_URL : `${api.MEDIA_URL}`; // Ensure mediaUrl ends with '/'

const AvatarImage = ({ imagePath }) => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    fetch(`${mediaUrl}/getImage/?imagePath=${encodeURIComponent(imagePath)}`)
      .then((response) => response.json())
      .then((data) => setImageData(data.data))
      .catch((error) => {
        console.error("Error fetching image data:", error);
      });
  }, [imagePath]);


  return (
    <div>
      <p>hello</p>
      <img
        src={imageData && { imageData }}
        alt="Image"
        className="avatar-xxs rounded-circle"
      />

    </div>
  );
};

export default AvatarImage;
