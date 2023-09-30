// CircleImage.js

import React from "react";
import { api } from "../../config";
import { Row, Col, Card, CardImg } from "reactstrap";
import { Link } from "react-router-dom";
import { Badge } from 'reactstrap'; // Or your preferred UI library if not using reactstrap

const mediaUrl = api.MEDIA_URL.endsWith('/') ? api.MEDIA_URL : `${api.MEDIA_URL}/`; // Ensure mediaUrl ends with '/'
const defaultImagePath = 'media/candidates/default.jpg';

const defaultCandidatePath = 'media/candidates/default.jpg';
const defaultElectionPath = 'media/candidates/default.jpg';
const defaultUserPath = 'media/candidates/default.jpg';


export const ImageCircle = ({ imagePath }) => {
  const imageUrl = `${mediaUrl}${imagePath}`;

  return (
    <div className="avatar-xs flex-shrink-0 me-3">
      <img src={imageUrl} alt="" className="img-fluid rounded-circle" />
    </div>
  );
};

export const ImageGenderCircle = ({ imagePath, genderValue }) => {
  const imageUrl = `${mediaUrl}${imagePath}`;

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

export const AvatarMedium = ({ row }) => {
  if (!row || !row.original) return null; // If row or row.original is undefined, don't render the component

  const { id, image, name } = row.original;
  const imageUrl = image ? `${mediaUrl}${image}` : `${mediaUrl}${defaultImagePath}`;

  return (
    <React.Fragment>

      <div className="d-flex align-items-center">
        <div className="avatar-md"> {/* To maintain the image size */}
          <img
            src={imageUrl}
            alt={name}
            className="img-thumbnail rounded-circle"
          />
        </div>
        <Link to={`/elections/${id}`} className="fw-medium link-primary flex-grow-1 ms-2 name">
          <strong>
            {name}
          </strong>
        </Link>
      </div>
    </React.Fragment>
  );
};


export const ImageMedium = ({ imagePath }) => {
  const imageUrl = imagePath ? `${mediaUrl}${imagePath}` : `${mediaUrl}${defaultImagePath}`;

  return (
    <React.Fragment>

      <div className="d-flex align-items-center">
        <div className="avatar-md"> {/* To maintain the image size */}
          <img
            src={imageUrl}
            alt=""
            className="img-thumbnail rounded-circle"
          />
        </div>
      </div>
    </React.Fragment>
  );
};


export const ImageCandidateWinnerCircle = ({ gender, name, imagePath, is_winner }) => {
  const imageUrl = imagePath ? `${mediaUrl}${imagePath}` : `${mediaUrl}${defaultImagePath}`;

  let borderColor;

  if (gender === 1) {
    borderColor = "#4e8dff";
  } else if (gender === 2) {
    borderColor = "#ff4ef8";
  } else {
    borderColor = "#9e9e9e";
  }

  return (
    <div className="d-flex align-items-center">
      <div
        className="avatar-xs"
        style={{
          display: "inline-block",
          borderRadius: "50%",
          border: `2px solid ${borderColor}`,
        }}
      >
        <img src={imageUrl} alt={name} className="img-fluid rounded-circle" />
      </div>
      <div className="flex-grow-1 ms-2 name">
        <strong>
          {name}
        </strong>
        {is_winner && (
          <Badge color="success" className="badge-label">
            <i className="mdi mdi-circle-medium"></i> فائز
          </Badge>
        )}
      </div>
    </div>
  );
};



export const ImageCampaignBackground = ({ imagePath }) => {
  const imageUrl = `${mediaUrl}${imagePath}`;

  return (
    <div className="profile-foreground position-relative mx-n4 mt-n4">
      <div className="profile-wid-bg">
        <img src={imageUrl} alt="" className="profile-wid-img" />
      </div>
    </div>
  );
};
export const ImageCandidateCampaign = ({ imagePath }) => {
  const imageUrl = `${mediaUrl}${imagePath}`;

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
  const imageUrl = `${mediaUrl}${imagePath}`;

  return (
    <div className="avatar-xs flex-shrink-0 me-3">
      <img src={imageUrl} alt="" className="img-fluid rounded-circle" />
    </div>
  );
};

export const ImageCampaignCard = ({ urlPath, imagePath }) => {
  const imageUrl = `${mediaUrl}${imagePath}`;

  return (
    <Card className="mb-4">
      <Row className="g-0 h-100">
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
