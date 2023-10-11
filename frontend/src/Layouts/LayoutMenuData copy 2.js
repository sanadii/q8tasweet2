import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userSelector } from 'Selectors';
import getAdminMenu from "./Menus/AdminMenu";

const Navdata = () => {
  const history = useNavigate();
  // const currentUser = useSelector(userSelector);
  // const roles = currentUser.roles || [];
  // const isAdmin = roles.includes('isAdmin');
  const isAdmin = true; // Temporarily set to true for debugging

  // If getAdminMenu expects parameters, pass them. Otherwise, use as is.
  const AdminMenu = getAdminMenu();

  // Render menu items. Assuming that AdminMenu returns JSX items. If not, you need to map and render.
  const renderMenuItems = () => {
    if (isAdmin) {
      return AdminMenu.map((item, index) => {
        // This is a basic rendering. Update according to the actual structure of your menu items.
        return <div key={index}>{item.label}</div>;
      });
    }
    return null;
  };
  // console.log("currentUser", currentUser);
  console.log("isAdmin", isAdmin);
  console.log("AdminMenu", AdminMenu);
  
  return <React.Fragment>{renderMenuItems()}</React.Fragment>;
};

export default Navdata;
