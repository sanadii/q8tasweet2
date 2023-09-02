// CircleImage.js

import React from "react";
import { api } from "../../config";
import { Row, Col, Card, CardImg } from "reactstrap";
import { Link } from "react-router-dom";

export const ImageCircle = ({ imagePath }) => {
  const apiUrl = api.API_URL;
  const imageUrl = `${apiUrl}${imagePath}`;

  return (
    <div className="avatar-xs flex-shrink-0 me-3">
      <img src={imageUrl} alt="" className="img-fluid rounded-circle" />
    </div>
  );
};

export const ImageGenderCircle = ({ imagePath, genderValue }) => {
  const apiUrl = api.API_URL;
  const imageUrl = `${apiUrl}${imagePath}`;

  let borderColor;

  if (genderValue === 1) {
    borderColor = "#4e8dff";
  } else if (genderValue === 2) {
    borderColor = "#ff4ef8";
  } else {
    borderColor = "#9e9e9e";
  }

  return (
    <div
      style={{
        display: "inline-block",
        borderRadius: "50%",
        border: `3px solid ${borderColor}`,
      }}
    >
      <img src={imageUrl} alt="" className="rounded-circle avatar-xs" />
    </div>
  );
};

export const ImageLargeCircle = ({ imagePath }) => {
  const apiUrl = api.API_URL;
  const imageUrl = `${apiUrl}${imagePath}`;

  return (
    <div className="avatar-lg">
      <img
        src={imageUrl}
        alt="user-img"
        className="img-thumbnail rounded-circle"
      />
    </div>
  );
};

export const ImageCampaignBackground = ({ imagePath }) => {
  const apiUrl = api.API_URL;
  const imageUrl = `${apiUrl}${imagePath}`;

  return (
    <div className="profile-foreground position-relative mx-n4 mt-n4">
      <div className="profile-wid-bg">
        <img src={imageUrl} alt="" className="profile-wid-img" />
      </div>
    </div>
  );
};
export const ImageCandidateCampaign = ({ imagePath }) => {
  const apiUrl = api.API_URL;
  const imageUrl = `${apiUrl}${imagePath}`;

  return (
    <div className="avatar-sm rounded">
      <img
        src={imageUrl}
        alt=""
        className="member-img img-fluid d-block rounded"
      ></img>
    </div>
  );
};

export const ImageRoundedCircleXS = ({ imagePath }) => {
  const apiUrl = api.API_URL;
  const imageUrl = `${apiUrl}${imagePath}`;

  return (
    <div className="avatar-xs flex-shrink-0 me-3">
      <img src={imageUrl} alt="" className="img-fluid rounded-circle" />
    </div>
  );
};

export const ImageCampaignCard = ({ urlPath, imagePath }) => {
  const apiUrl = api.API_URL;
  const imageUrl = `${apiUrl}${imagePath}`;

  return (
    <Card className="mb-4">
      <Row noGutters={true} className="h-100">
        <Col className="position-relative">
          <Link to={urlPath} className="d-block">
            <CardImg top src={imageUrl} alt="" className="w-100" />
            <div className="bg-overlay position-absolute w-100 h-100 opacity-0 hover-opacity-20"></div>
            <style
              dangerouslySetInnerHTML={{
                __html: `
            .hover-opacity-20:hover {
              opacity: 0.2 !important;
            }
          `,
              }}
            />
          </Link>
        </Col>
      </Row>
    </Card>
  );
};
