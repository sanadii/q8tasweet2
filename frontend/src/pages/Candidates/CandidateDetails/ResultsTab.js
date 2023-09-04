import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";

const ResultsTab = ({ candidate }) => {
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <div className="d-flex align-items-center mb-4">
            <h5 className="card-title flex-grow-1">Documents</h5>
          </div>
          <Row>
            <Col>
              <div className="table-responsive mt-4 mt-xl-0">
                <Table className="table-hover table-striped align-middle table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Rank</th>
                      <th scope="col">Name</th>
                      <th scope="col">Total</th>
                      <th scope="col">Com 1</th>
                      <th scope="col">Com 2</th>
                      <th scope="col">Com 3</th>
                      <th scope="col">Com 4</th>
                      <th scope="col">Com 5</th>
                      <th scope="col">Com 6</th>
                      <th scope="col">Com 7</th>
                      <th scope="col">Com 8</th>
                      <th scope="col">Com 1</th>
                      <th scope="col">Com 2</th>
                      <th scope="col">Com 3</th>
                      <th scope="col">Com 4</th>
                      <th scope="col">Com 5</th>
                      <th scope="col">Com 6</th>
                      <th scope="col">Com 7</th>
                      <th scope="col">Com 8</th>
                      <th scope="col">Com 1</th>
                      <th scope="col">Com 2</th>
                      <th scope="col">Com 3</th>
                      <th scope="col">Com 4</th>
                      <th scope="col">Com 5</th>
                      <th scope="col">Com 6</th>
                      <th scope="col">Com 7</th>
                      <th scope="col">Com 8</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-medium">01</td>
                      <td>Musalam Al Barrak</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                    </tr>
                    <tr>
                      <td className="fw-medium">02</td>
                      <td>Musalam Al Barrak</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                    </tr>
                    <tr>
                      <td className="fw-medium">03</td>
                      <td>Mohannad Al Sayer</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                    </tr>
                    <tr>
                      <td className="fw-medium">04</td>
                      <td>Musalam Al Barrak</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ResultsTab;
