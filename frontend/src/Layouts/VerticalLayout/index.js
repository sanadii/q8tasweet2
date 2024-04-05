import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { useNavigate, Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import { layoutSelector } from 'selectors/layoutSelector';

// Import Data
import menuItems from "../LayoutMenuData";
import { withRouter } from 'shared/components';
import { useSelector, useDispatch } from "react-redux";
import { getCampaignDetails } from "store/actions";

const Menu = ({ item }) => (
    item.isHeader ? (
        <li className="menu-title"><span data-key="t-menu">{item.label}</span></li>
        // ) : item.isCampaign ? (
        //     <CampaignMenu item={item} />
    ) : item.subItems ? (
        <CollapsibleMenuItem item={item} />
    ) : (
        <MenuItem item={item} />
    )
);

const MenuItem = ({ item }) => (
    <li className="nav-item">
        <Link
            className="nav-link menu-link"
            to={item.link ? item.link : "/#"}
        >
            <i className={item.icon}></i> <span>{item.label}</span>
            {item.badgeName && (
                <span className={"badge badge-pill bg-" + item.badgeColor} data-key="t-new">{item.badgeName}</span>
            )}
        </Link>
    </li>
);

const CollapsibleMenuItem = ({ item }) => (
    <li className="nav-item">
        <Link
            onClick={item.click}
            className="nav-link menu-link"
            to={item.link ? item.link : "/#"}
            data-bs-toggle="collapse"
        >
            <i className={item.icon}></i>
            <span data-key="t-apps">{item.label}</span>
            {item.badgeName && (
                <span className={"badge badge-pill bg-" + item.badgeColor} data-key="t-new">{item.badgeName}</span>
            )}
        </Link>
        <Collapse
            className="menu-dropdown"
            isOpen={item.stateVariables}
            id="sidebarApps"
        >
            <ul className="nav nav-sm flex-column test">
                {item.subItems && item.subItems.map((subItem, key) => (
                    <SubItem key={key} subItem={subItem} />
                ))}
            </ul>
        </Collapse>
    </li>
);

const SubItem = ({ subItem }) => (
    <li className="nav-item">
        <Link
            to={subItem.link ? subItem.link : "/#"}
            className="nav-link"
            onClick={subItem.click}
        >
            {subItem.label}
            {subItem.badgeName && (
                <span className={"badge badge-pill bg-" + subItem.badgeColor} data-key="t-new">{subItem.badgeName}</span>
            )}
        </Link>
    </li>
);

const VerticalLayout = (props) => {

    const navData = menuItems().props.children;
    const path = props.router.location.pathname;
    const [selectedCampaign, setSelectedCampaign] = useState("")

    /*
    layout settings
    */
    const {
        leftsidbarSizeType, sidebarVisibilitytype, layoutType
    } = useSelector(layoutSelector);


    //vertical and semibox resize events
    const resizeSidebarMenu = useCallback(() => {
        var windowSize = document.documentElement.clientWidth;
        if (windowSize >= 1025) {
            if (document.documentElement.getAttribute("data-layout") === "vertical") {
                document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType);
            }
            if (document.documentElement.getAttribute("data-layout") === "semibox") {
                document.documentElement.setAttribute("data-sidebar-size", leftsidbarSizeType);
            }
            if ((sidebarVisibilitytype === "show" || layoutType === "vertical" || layoutType === "twocolumn") && document.querySelector(".hamburger-icon")) {
                document.querySelector(".hamburger-icon").classList.remove("open");
            } else {
                document.querySelector(".hamburger-icon").classList.add("open");
            }

        } else if (windowSize < 1025 && windowSize > 767) {
            document.body.classList.remove("twocolumn-panel");
            if (document.documentElement.getAttribute("data-layout") === "vertical") {
                document.documentElement.setAttribute("data-sidebar-size", "sm");
            }
            if (document.documentElement.getAttribute("data-layout") === "semibox") {
                document.documentElement.setAttribute("data-sidebar-size", "sm");
            }
            if (document.querySelector(".hamburger-icon")) {
                document.querySelector(".hamburger-icon").classList.add("open");
            }
        } else if (windowSize <= 767) {
            document.body.classList.remove("vertical-sidebar-enable");
            if (document.documentElement.getAttribute("data-layout") !== "horizontal") {
                document.documentElement.setAttribute("data-sidebar-size", "lg");
            }
            if (document.querySelector(".hamburger-icon")) {
                document.querySelector(".hamburger-icon").classList.add("open");
            }
        }
    }, [leftsidbarSizeType, sidebarVisibilitytype, layoutType]);

    useEffect(() => {
        window.addEventListener("resize", resizeSidebarMenu, true);
    }, [resizeSidebarMenu]);


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const initMenu = () => {
            const pathName = process.env.PUBLIC_URL + path;
            const ul = document.getElementById("navbar-nav");
            const items = ul.getElementsByTagName("a");
            let itemsArray = [...items]; // converts NodeList to Array
            removeActivation(itemsArray);
            let matchingMenuItem = itemsArray.find((x) => {
                return x.pathname === pathName;
            });
            if (matchingMenuItem) {
                activateParentDropdown(matchingMenuItem);
            }
        };
        // if (props.layoutType === "vertical") {
        initMenu();
        // }
    }, [path, props.layoutType]);

    function activateParentDropdown(item) {
        item.classList.add("active");
        let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

        if (parentCollapseDiv) {
            // to set aria expand true remaining
            parentCollapseDiv.classList.add("show");
            parentCollapseDiv.parentElement.children[0].classList.add("active");
            parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
            if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
                parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
                if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
                if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse")) {
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").classList.add("show");
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").previousElementSibling.classList.add("active");
                }
            }
            return false;
        }
        return false;
    }

    const removeActivation = (items) => {
        let actiItems = items.filter((x) => x.classList.contains("active"));

        actiItems.forEach((item) => {
            if (item.classList.contains("menu-link")) {
                if (!item.classList.contains("active")) {
                    item.setAttribute("aria-expanded", false);
                }
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
            }
            if (item.classList.contains("nav-link")) {
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
                item.setAttribute("aria-expanded", false);
            }
            item.classList.remove("active");
        });
    };

    return (
        <React.Fragment>
            {navData.map((item, key) => (
                <React.Fragment key={key}>
                    <Menu item={item} />
                </React.Fragment>
            ))}

        </React.Fragment>
    );
}


VerticalLayout.propTypes = {
    location: PropTypes.object,
    t: PropTypes.any,
};

export default withRouter(VerticalLayout);
