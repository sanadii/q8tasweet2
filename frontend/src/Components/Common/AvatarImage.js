/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

const AvatarImage = ({ imagePath }) => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/getImage/?imagePath=${encodeURIComponent(imagePath)}`)
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
