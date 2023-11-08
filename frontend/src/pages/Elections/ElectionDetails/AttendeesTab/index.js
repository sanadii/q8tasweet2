// Component Import
import React, { useState, useEffect, useSelector, useDispatch, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, Modal, Row, UncontrolledDropdown, ModalBody, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane
} from "reactstrap";

import classnames from "classnames";

// Component Import
import Loader from "components/Components/Loader";

const AttendeesTab = ({ electionCandidates }) => {
    return (
        <React.Fragment>
            <Row className="g-4 mb-3">
                <h1>GuaranteesTab</h1>
            </Row>

        </React.Fragment>
    );
};

export default AttendeesTab;
