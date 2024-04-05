import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { layoutSelector, userSelector, campaignSelector } from 'selectors';
import { getCampaignDetails } from "store/actions";

const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

const CampaignDropdown = ({ onChangeCampaign }) => {
    const { currentUser } = useSelector(userSelector);
    const currentUserCampaigns = currentUser?.campaigns

    return (
        <React.Fragment>
            {
                currentUserCampaigns.map((userCampaign, key) => (

                    <span
                        tag="button"
                        type="button"
                        key={key}
                        title={userCampaign.name}
                        onClick={onChangeCampaign(userCampaign)}
                        className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle topbar-head-dropdown ms-1 header-item"
                    >
                        {userCampaign.image
                            ? <img src={`${MEDIA_URL}${userCampaign.image}`} alt={userCampaign.name} className="rounded-circle" style={{ width: '22px', height: '22px' }} />
                            : <i className='mdi mdi-account-convert fs-22'></i> // Fallback icon
                        }
                    </span>
                ))
            }

        </React.Fragment>
    );
};

export default CampaignDropdown;