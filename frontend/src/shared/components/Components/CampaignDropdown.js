import React, { useState, useEffect } from 'react';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { layoutSelector, userSelector, campaignSelector } from 'selectors';
import { getCampaignDetails } from "store/actions";

const MEDIA_URL = process.env.REACT_APP_MEDIA_URL;

const CampaignDropdown = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(userSelector);
    const { campaign, userCampaigns } = useSelector(userSelector);
    const [currentCampaign, setCurrentCampaign] = useState(null);
    const currentUserCampaigns = currentUser?.campaigns;

    // Update currentCampaign when userCampaigns changes
    useEffect(() => {
        if (userCampaigns && userCampaigns.length > 0) {
            const selectedCampaign = userCampaigns[0];
            setCurrentCampaign(selectedCampaign);
            if (!currentCampaign) {
                dispatch(getCampaignDetails(selectedCampaign.slug));
            }
        } else {
            setCurrentCampaign(null);
        }
    }, [dispatch, campaign, currentCampaign, userCampaigns]);


    const onCampaignSelection = (userCampaign) => () => {
        setCurrentCampaign(userCampaign);
        dispatch(getCampaignDetails(userCampaign.slug));
    };


    return (
        <React.Fragment>
            {currentUserCampaigns && currentUserCampaigns.map((userCampaign, key) => (
                <span
                    key={key}
                    title={userCampaign.name}
                    onClick={onCampaignSelection(userCampaign)}
                    className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle topbar-head-dropdown ms-1 header-item"
                >
                    {userCampaign.image
                        ? <img src={`${MEDIA_URL}${userCampaign.image}`} alt={userCampaign.name} className="rounded-circle" style={{ width: '22px', height: '22px' }} />
                        : <i className='mdi mdi-account-convert fs-22'></i> // Fallback icon
                    }
                </span>
            ))}
        </React.Fragment>
    );
};

export default CampaignDropdown;
