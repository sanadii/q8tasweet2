import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PropTypes from "prop-types";
import { withRouter } from 'shared/components';
import SectionHeader from "pages/CampaignDetails/SectionHeader"
import { Container } from "reactstrap";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
// import RightSidebar from '../Components/Common/RightSidebar';

// Redux and Selectors
import { layoutSelector, userSelector, campaignSelector } from 'selectors';

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

// Hooks & Utils
import { WebSocketProvider } from 'shared/utils';

const Layout = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [headerClass, setHeaderClass] = useState("");

    const defaultLayout = props.defaultLayout;
    const style = props.style;

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
    const onChangeCampaign = (userCampaign) => {
        // setCurrentCampaign(userCampaign)
        // console.log("dispatching: ", currentCampaign)
        // dispatch(getCampaignDetails(currentCampaign.slug))
        // navigate(`/campaigns/${currentCampaign.slug}`);
    };

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
                                    <WebSocketProvider channel="campaigns" slug={campaign.slug}>
                                        <SectionHeader campaign={campaign} campaignMembers={campaignMembers} campaignGuarantees={campaignGuarantees} />
                                        {props.children}
                                    </WebSocketProvider>
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

            </div>
            {/* <RightSidebar /> */}
        </React.Fragment >

    );
};

Layout.propTypes = {
    children: PropTypes.any,
};

export default withRouter(Layout);
