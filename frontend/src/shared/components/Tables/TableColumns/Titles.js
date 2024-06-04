import React from "react";
import { api } from "config";
import { Link } from "react-router-dom";
import { Badge } from 'reactstrap'; // Or your preferred UI library if not using reactstrap
import { getStatusBadge, GenderOptions } from "shared/constants/";


const mediaUrl = api?.MEDIA_URL?.endsWith('/') ? api.MEDIA_URL.slice(0, -1) : api.MEDIA_URL;
const defaultImagePath = '/media/candidates/default.jpg';

const defaultCandidatePath = '/media/candidates/default.jpg';
const defaultElectionPath = '/media/candidates/default.jpg';
const defaultUserPath = '/media/candidates/default.jpg';
const defaultCampaignBgPath = '/media/candidates/default.jpg';


const Title = (cellProps) => {
    const { title, subTitle, gender } = cellProps
    const getGenderIcon = (gender) => {
        const genderOption = GenderOptions.find(g => g.id === gender);
        if (genderOption) {
            const genderColorClass = `text-${genderOption.color}`;
            return <i className={`mdi mdi-circle align-middle ${genderColorClass} me-2`}></i>;
        }
        return null;
    };

    return (
        <div>
            {getGenderIcon(gender)}
            <b>{title}</b>
            <br />
            {subTitle && subTitle}
        </div>
    );
};

const NameAvatar = (cellProps) => {
    const { id, name, gender, image, slug, dirName, handleClickedItem } = cellProps
    const imageUrl = image ? `${mediaUrl}${image}` : `${mediaUrl}${defaultImagePath}`;

    // For other dirName values, render the link
    return (
        <Link to={`/dashboard/${dirName}/${slug}`} className="d-flex align-items-center link-primary">
            {image &&
                <div className="avatar-sm">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="img-thumbnail rounded-circle"
                    />
                </div>
            }

            <strong className="ps-2">
                {name}
            </strong>
        </Link>
    );
};

const Name = (cellProps) => {
    const { id, name, gender, handleClickedItem } = cellProps;
    // const campaignMember = cellProps.row.original;

    return (
        <div
            className="flex-grow-1 ms-2 name"
        // onClick={() => {
        //     handleClickedItem(campaignMember);
        // }}
        >
            <b>{name}</b>
        </div>
    );
};

const SimpleName = ({ name, slug, urlDir }) => {
    return (
        <React.Fragment>
            <Link
                to={`/dashboard/${urlDir}/${slug}`}
                className="fw-medium link-primary"
            >
                {name}
            </Link>{" "}
        </React.Fragment>
    );
};


const ResultCandidateName = ({ name, image, result }) => {
    // const { id, name, image, gender, slug, imagePath, result } = cellProps.row.original;

    // Define result statuses
    const isWinner = result === "فاز";
    const isEliminated = result === "مشطوب";
    const isSteppedDown = result === "تنازل";

    const imageUrl = image ? `${process.env.REACT_APP_MEDIA_URL}${image}` : `${process.env.REACT_APP_MEDIA_URL}${defaultImagePath}`;

    return (
        <div className="d-flex align-items-center link-primary">
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
        </div>
    );
};

export { Title, NameAvatar, SimpleName, Name, ResultCandidateName };