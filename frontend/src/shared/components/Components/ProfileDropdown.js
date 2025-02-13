import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, } from "reactstrap";
import SwiperCore, { Autoplay } from "swiper";
import { createSelector } from 'reselect';
import { Link, useNavigate } from "react-router-dom";

// Store & Selectors
import { userSelector } from 'selectors';
import { logoutUser } from "../../../store/actions";

//import images
import avatar1 from "assets/images/users/avatar-1.jpg";
import { useProfile } from "shared/hooks";

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector(userSelector);
  const { token } = useProfile();

  const isStaff = currentUser?.isStaff
  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };


  const handleLogoutClick = () => {
    dispatch(logoutUser())
    navigate("/");

  }


  return (
    <React.Fragment>
      <div>
        <Dropdown
          isOpen={isProfileDropdown}
          toggle={toggleProfileDropdown}
          className="ms-sm-3 header-item topbar-user"
        >
          <DropdownToggle tag="button" type="button" className="btn">
            <span className="d-flex align-items-center">
              <img
                className="rounded-circle header-profile-user"
                src={avatar1}
                alt="Header Avatar"
              />
              <span className="text-start ms-xl-2">
                <span className="d-none d-xl-inline-block ms-1 fw-medium user-userId-text">
                  {currentUser?.lastName}
                </span>
                <span className="d-none d-xl-block ms-1 fs-12 text-muted user-userId-sub-text">
                  {currentUser?.firstName}
                </span>
              </span>
            </span>
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            {/* <h6 className="dropdown-header">Welcome {userName}!</h6> */}
            <DropdownItem href={"/dashboard"}>
              <i className="mdi mdi mdi-monitor-dashboard text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">لوحة التحكم</span>
            </DropdownItem>
            <DropdownItem href={"dashboard/profile"}>

              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">الملف الشخصي</span>
            </DropdownItem>

            {isStaff && (
              <>
                <DropdownItem href={process.env.REACT_APP_PUBLIC_URL + "/apps-chat"}>
                  <span className="badge bg-soft-danger text-danger mt-1 float-end">
                    معطّل
                  </span>
                  <i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i>{" "}
                  <span className="align-middle">الرسائل</span>
                </DropdownItem>
                <DropdownItem href="#">
                  <span className="badge bg-soft-danger text-danger mt-1 float-end">
                    معطّل
                  </span>
                  <i className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i>{" "}
                  <span className="align-middle">المفضلة</span>
                </DropdownItem>
                <DropdownItem href={process.env.REACT_APP_PUBLIC_URL + "/pages-faqs"}>
                  <span className="badge bg-soft-danger text-danger mt-1 float-end">
                    معطّل
                  </span>
                  <i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i>{" "}
                  <span className="align-middle">مساعدة</span>
                </DropdownItem>
              </>

            )}
            <div className="dropdown-divider"></div>
            <DropdownItem href={process.env.REACT_APP_PUBLIC_URL + "/pages-profile"}>
              <i className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle">
                الاشتراك : <b>أساسي</b>
              </span>
            </DropdownItem>
            {isStaff && (

              <DropdownItem
                href={process.env.REACT_APP_PUBLIC_URL + "/pages-profile-settings"}
              >
                <span className="badge bg-soft-danger text-danger mt-1 float-end">
                  معطّل
                </span>
                <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>{" "}
                <span className="align-middle">الإعدادات</span>
              </DropdownItem>
            )}
            <DropdownItem
              href={process.env.REACT_APP_PUBLIC_URL + "/auth-lockscreen-basic"}
            >
              <i className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle">قفل الشاشة</span>
            </DropdownItem>

            {
              currentUser && (
                <DropdownItem
                  onClick={handleLogoutClick}
                >
                  <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
                  <span className="align-middle" data-key="t-logout">
                    تسجيل خروج
                  </span>
                </DropdownItem>)
            }

          </DropdownMenu>
        </Dropdown>
      </div>
    </React.Fragment>
  );
};

export default ProfileDropdown;
