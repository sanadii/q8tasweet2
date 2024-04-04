import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Input, Label } from 'reactstrap';
import { userSelector } from 'selectors';

//import images
import avatar1 from 'assets/images/users/avatar-1.jpg';

const EditProfileImage = ({ userDetails = null, selectImage = () => null, ...props }) => {
    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";

    const { user } = useSelector(userSelector);

    const [uploadProfileImage, setUploadProfileImage] = useState({
        userProfileImage: userDetails?.image ?? '', imagePreview: '', showUploadButton: false
    });

    const onSelectImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setUploadProfileImage({
                ...uploadProfileImage, profileImage: event.target.files[0],
                imagePreview: URL?.createObjectURL(img),
                showUploadButton: true
            });
            selectImage(event.target.files[0])
        }
    }
    console.log("TEST USERS===>", process.env.REACT_APP_MEDIA_URL + uploadProfileImage?.userProfileImage);
    return (
        <React.Fragment>
            <Card>
                <CardBody className="p-4">
                    <div className="text-center">
                        <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                            <img src={
                                uploadProfileImage?.imagePreview ? uploadProfileImage?.imagePreview
                                    : uploadProfileImage?.userProfileImage ? process.env.REACT_APP_MEDIA_URL + uploadProfileImage?.userProfileImage
                                        : avatar1
                            }
                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                alt="user-profile" />

                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                <Input id="profile-img-file-input" type="file" accept="image/*"
                                    className="profile-img-file-input"
                                    onChange={(event) => onSelectImage(event)}
                                />
                                <Label htmlFor="profile-img-file-input"
                                    className="profile-photo-edit avatar-xs">
                                    <span className="avatar-title rounded-circle bg-light text-body">
                                        <i className="ri-camera-fill"></i>
                                    </span>
                                </Label>
                            </div>
                        </div>
                        <h5 className="fs-16 mb-1">{user.fullName}</h5>
                        <p className="text-muted mb-0">{user.email}</p>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default EditProfileImage;