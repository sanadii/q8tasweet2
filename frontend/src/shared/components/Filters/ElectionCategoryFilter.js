// Components/Common/Filters/ElectionCategoryFilter.js
import React from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";
import { electionSelector, categorySelector } from 'Selectors';
import { Nav, NavItem, NavLink, Input } from "reactstrap";


const ElectionCategoryFilter = ({ filters, setFilters, activeTab, setActiveTab }) => {

    const { elections } = useSelector(electionSelector);
    const { categories } = useSelector(categorySelector);
  
    // Compute the count for each category
    const categoryCounts = categories.reduce((counts, category) => {
      counts[category.id] = elections.filter(
        (item) => item.category === category.id
      ).length;
      return counts;
    }, {});
  
    const ChangeElectionCategory = (tab, type) => {
      if (activeTab !== tab) {
        setActiveTab(tab);
        if (type !== "الكل") {
          setFilters(prevFilters => ({
            ...prevFilters,
            category: type
          }));
        } else {
          setFilters(prevFilters => ({
            ...prevFilters,
            category: null
          }));
        }
      }
    };
  
    return (
      <React.Fragment>
        <div>
          <Nav
            className="nav-tabs-custom card-header-tabs border-bottom-0"
            role="tablist"
          >
            <NavItem>
              <NavLink
                className={classnames(
                  { active: activeTab === "" },
                  "fw-semibold"
                )}
                onClick={() => {
                  ChangeElectionCategory("", "الكل");
                }}
                href="#"
              >
                الكل
              </NavLink>
            </NavItem>
            {categories.map((category, index) => (
              <NavItem key={category.id}>
                <NavLink
                  className={classnames(
                    { active: activeTab === String(index + 1) },
                    "fw-semibold"
                  )}
                  onClick={() => {
                    ChangeElectionCategory(String(index + 1), category.id);
                  }}
                  href="#"
                >
                  {category.name}
                  <span className="badge badge-soft-danger align-middle rounded-pill ms-1">
                    {categoryCounts[category.id]}{" "}
                    {/* Replace with actual badge count */}
                  </span>
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </div>
      </React.Fragment>
    );
  };

  export default ElectionCategoryFilter