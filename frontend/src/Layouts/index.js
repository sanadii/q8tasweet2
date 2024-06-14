import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import PropTypes from "prop-types";
import { withRouter } from 'shared/components';
import { layoutSelector, campaignSelector } from 'selectors';
import SectionHeader from "pages/Campaigns/CampaignDetails/SectionHeader"
import { Container } from "reactstrap";

//import Components
=======
import { useNavigate } from 'react-router-dom';

import PropTypes from "prop-types";
import { withRouter } from 'shared/components';
import SectionHeader from "pages/CampaignDetails/SectionHeader"
import { Container } from "reactstrap";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { layoutSelector, userSelector, campaignSelector } from 'selectors';

// Components
>>>>>>> sanad
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
// import RightSidebar from '../Components/Common/RightSidebar';

//import actions
import {
    changeLayout,
    changeSidebarTheme,
    changeLayoutMode,
    changeLayoutWidth,
    changeLayoutPosition,
    changeTopbarTheme,
    changeLeftsidebarSizeType,
    changeLeftsidebarViewType,
    changeSidebarImageType,
    changeSidebarVisibility,

    // Campaigns
    getCampaignDetails,
} from "../store/actions";

<<<<<<< HEAD
//redux
import { useSelector, useDispatch } from "react-redux";

const Layout = (props) => {
    const [headerClass, setHeaderClass] = useState("");
    const defaultLayout = props.defaultLayout;
    const style = props.style;

    const dispatch = useDispatch();
=======

const Layout = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [headerClass, setHeaderClass] = useState("");

    const defaultLayout = props.defaultLayout;
    const style = props.style;

>>>>>>> sanad
    const {
        layoutType,
        leftSidebarType,
        layoutModeType,
        layoutWidthType,
        layoutPositionType,
        topbarThemeType,
        leftsidbarSizeType,
        leftSidebarViewType,
        leftSidebarImageType,
        sidebarVisibilitytype
    } = useSelector(layoutSelector);


    const {
        campaign,
        campaignMembers,
        campaignRoles,
        campaignGuarantees,
        campaignAttendees,
    } = useSelector(campaignSelector);
<<<<<<< HEAD
=======

>>>>>>> sanad
    /*
    layout settings
    */
    useEffect(() => {
        if (
            layoutType ||
            leftSidebarType ||
            layoutModeType ||
            layoutWidthType ||
            layoutPositionType ||
            topbarThemeType ||
            leftsidbarSizeType ||
            leftSidebarViewType ||
            leftSidebarImageType ||
            sidebarVisibilitytype
        ) {
            window.dispatchEvent(new Event('resize'));
            dispatch(changeLeftsidebarViewType(leftSidebarViewType));
            dispatch(changeLeftsidebarSizeType(leftsidbarSizeType));
            dispatch(changeSidebarTheme(leftSidebarType));
            dispatch(changeLayoutMode(layoutModeType));
            dispatch(changeLayoutWidth(layoutWidthType));
            dispatch(changeLayoutPosition(layoutPositionType));
            dispatch(changeTopbarTheme(topbarThemeType));
            (defaultLayout) && dispatch(changeLayout(defaultLayout));
            dispatch(changeSidebarImageType(leftSidebarImageType));
            dispatch(changeSidebarVisibility(sidebarVisibilitytype));
        }
    }, [layoutType,
        leftSidebarType,
        layoutModeType,
        layoutWidthType,
        layoutPositionType,
        topbarThemeType,
        leftsidbarSizeType,
        leftSidebarViewType,
        leftSidebarImageType,
        sidebarVisibilitytype,
        defaultLayout,
        dispatch]);

    useEffect(() => {
        if (sidebarVisibilitytype === 'show' || layoutType === "vertical" || layoutType === "twocolumn") {
            document.querySelector(".hamburger-icon").classList.remove('open');
        } else {
            document.querySelector(".hamburger-icon").classList.add('open');
        }
    }, [sidebarVisibilitytype, layoutType]);
    /*
    call dark/light mode
    */
<<<<<<< HEAD
=======
    const onChangeCampaign = (userCampaign) => {
        // setCurrentCampaign(userCampaign)
        // console.log("dispatching: ", currentCampaign)
        // dispatch(getCampaignDetails(currentCampaign.slug))
        // navigate(`/campaigns/${currentCampaign.slug}`);
    };

>>>>>>> sanad
    const onChangeLayoutMode = (value) => {
        if (changeLayoutMode) {
            dispatch(changeLayoutMode(value));
        }
    };

    // class add remove in header 
    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
    });

    function scrollNavigation() {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setHeaderClass("topbar-shadow");
        } else {
            setHeaderClass("");
        }
    }

    return (
        <React.Fragment>
            <div id="layout-wrapper">
                <Header
                    headerClass={headerClass}
                    layoutModeType={layoutModeType}
<<<<<<< HEAD
                    onChangeLayoutMode={onChangeLayoutMode} />
                <Sidebar
                    layoutType={layoutType}
                />
                <div className="main-content ">
                    {props.style === "campaign" &&
                        <div className="page-content">
                            <Container fluid>
                                <SectionHeader campaign={campaign} campaignMembers={campaignMembers} campaignGuarantees={campaignGuarantees} />
                            </Container>
                        </div>
                    }
                    <div className="p-3">
                        {props.children}
                    </div>
                    <Footer />
                </div>
=======
                    onChangeLayoutMode={onChangeLayoutMode}
                    setCurrentCampaign={props.setCurrentCampaign}
                />
                <Sidebar
                    layoutType={layoutType}
                />
                <div className="main-content">
                    {props.style === "campaign" ? (
                        campaign && campaign.election ? (
                            <div className="page-content">
                                <Container fluid>
                                    <SectionHeader campaign={campaign} campaignMembers={campaignMembers} campaignGuarantees={campaignGuarantees} />
                                    {props.children}
                                </Container>
                            </div>

                            // {campaign && campaign.election && props.style === "campaign" &&
                            // <div className="page-content">
                            //     <Container fluid>
                            //         {/* <SectionHeader campaign={campaign} campaignMembers={campaignMembers} campaignGuarantees={campaignGuarantees} /> */}
                            //     </Container>
                            // </div>

                            // }
                            // <div className="p-3">
                            // {props.children}
                            // </div>

                        ) : (
                            <p>Loading...</p>
                        )
                    ) : (
                        props.children
                    )}
                    <Footer />
                </div>

>>>>>>> sanad
            </div>
            {/* <RightSidebar /> */}
        </React.Fragment >

    );
};

Layout.propTypes = {
    children: PropTypes.any,
};

export default withRouter(Layout);
