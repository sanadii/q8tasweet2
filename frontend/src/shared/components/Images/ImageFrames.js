// CircleImage.js
import { GenderOptions } from "shared/constants";

import React from "react";
import { api } from "config";
import { Row, Col, Card, CardImg } from "reactstrap";
import { Link } from "react-router-dom";
import { Badge } from 'reactstrap'; // Or your preferred UI library if not using reactstrap

const mediaUrl = api?.MEDIA_URL?.endsWith('/') ? api.MEDIA_URL.slice(0, -1) : api.MEDIA_URL;
const defaultImagePath = '/media/candidates/default.jpg';

const defaultCandidatePath = '/media/candidates/default.jpg';
const defaultElectionPath = '/media/candidates/default.jpg';
const defaultUserPath = '/media/candidates/default.jpg';
const defaultCampaignBgPath = '/media/candidates/default.jpg';


export const ImageCircle = ({ imagePath }) => {
  const imageUrl = `${imagePath}`;

  return (
    <div className="avatar-xs flex-shrink-0 me-3">
      <img src={imageUrl} alt="" className="img-fluid rounded-circle" />
    </div>
  );
};

export const ImageGenderCircle = ({ imagePath, genderValue }) => {
  const imageUrl = `${imagePath}`;

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
        border: `2px solid ${borderColor}`,
      }}
    >
      <img src={imageUrl} alt="" className="rounded-circle avatar-xs" />
    </div>
  );
};



export const ResultCandidateName = ({ dirName, cellProps }) => {
  const { id, name, image, gender, slug, imagePath, result } = cellProps.row.original;

  // Define result statuses
  const isWinner = result === "فاز";
  const isEliminated = result === "مشطوب";
  const isSteppedDown = result === "تنازل";

  const imageUrl = image ? `${process.env.REACT_APP_MEDIA_URL}${image}` : `${process.env.REACT_APP_MEDIA_URL}${defaultImagePath}`;

  return (
    <Link to={`/dashboard/${dirName}/${slug}`} className="d-flex align-items-center link-primary">
      <div className="avatar-sm">
        <img
          src={imageUrl}
          alt={name}
          className="img-thumbnail rounded-circle"
        />
      </div>
      <div className="ms-2">
        <strong>{name}</strong>
        {isWinner && (
          <Badge color="success" className="ms-2">
            فائز
          </Badge>
        )}
        {isEliminated && (
          <Badge color="danger" className="ms-2">
            مشطوب
          </Badge>
        )}
        {isSteppedDown && (
          <Badge color="warning" className="ms-2">
            تنازل
          </Badge>
        )}
      </div>
    </Link>
  );
};




export const AvatarList = ({ dirName, row }) => {
  const { id, name, image, slug } = row.original;

  const imageUrl = image ? `${mediaUrl}${image}` : `${mediaUrl}${defaultImagePath}`;

  // For other dirName values, render the link
  return (
    <Link to={`/dashboard/${dirName}/${slug}`} className="d-flex align-items-center link-primary">
      <div className="avatar-sm">
        <img
          src={imageUrl}
          alt={name}
          className="img-thumbnail rounded-circle"
        />
      </div>
      <strong className="ps-2">
        {name}
      </strong>
    </Link>
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

export const ImageLarge = ({ imagePath }) => {
  const imageUrl = imagePath ? `${mediaUrl}${imagePath}` : `${mediaUrl}${defaultImagePath}`;

  return (
    <React.Fragment>

      <div className="d-flex align-items-center">
        <div className="avatar-lg"> {/* To maintain the image size */}
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


export const ImageCandidateWinnerCircle = ({ gender, name, imagePath, isWinner }) => {
  const imageUrl = imagePath ? `${mediaUrl}${imagePath}` : `${mediaUrl}${defaultImagePath}`;

  const genderObject = GenderOptions.find((g) => g.id === gender);
  const borderColor = genderObject ? genderObject.borderColor : "#9e9e9e";

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
        {isWinner && (
          <Badge color="success" className="badge-label">
            <i className="mdi mdi-circle-medium"></i> فائز
          </Badge>
        )}
      </div>
    </div>
  );
};


export const SectionBackagroundImage = ({ imagePath, length }) => {
  const imageUrl = imagePath ?
    `${mediaUrl}${imagePath}` :
    `${mediaUrl}${defaultCampaignBgPath}`;

  return (
    // <div className="profile-foreground position-relative mx-n4 mt-n4">
    <div className="profile-foreground mx-n4 mt-n4">
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
  const imageUrl = `${imagePath}`;

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
