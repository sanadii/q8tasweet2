import React from "react"; // Removed unnecessary imports
import { Link } from "react-router-dom";

import { Card, CardBody } from "reactstrap";


const OverviewSkills = () => {
    return (

        <Card>
            <CardBody>
                <h5 className="card-title mb-4">Skills</h5>
                <div className="d-flex flex-wrap gap-2 fs-15">
                    <Link to="#" className="badge badge-soft-primary">
                        Photoshop
                    </Link>
                    <Link to="#" className="badge badge-soft-primary">
                        illustrator
                    </Link>
                    <Link to="#" className="badge badge-soft-primary">
                        HTML
                    </Link>
                    <Link to="#" className="badge badge-soft-primary">
                        CSS
                    </Link>
                    <Link to="#" className="badge badge-soft-primary">
                        Javascript
                    </Link>
                    <Link to="#" className="badge badge-soft-primary">
                        Php
                    </Link>
                    <Link to="#" className="badge badge-soft-primary">
                        Python
                    </Link>
                </div>
            </CardBody>
        </Card>
    )
};
export default OverviewSkills;
