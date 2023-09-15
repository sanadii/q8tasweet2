import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Label, Row, Table, UncontrolledDropdown } from "reactstrap";

const ResultsTab = ({ election }) => {
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

                    </tr>
                    <tr>
                      <td className="fw-medium">02</td>
                      <td>Musalam Al Barrak</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>
                      <td>860</td>

                    </tr>
                    <tr>
                      <td className="fw-medium">03</td>
                      <td>Mohannad Al Sayer</td>
                      <td>860</td>

                    </tr>
                    <tr>
                      <td className="fw-medium">04</td>
                      <td>Musalam Al Barrak</td>
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


// import React from "react";
// import { Link } from "react-router-dom";
// import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Label, Row, Table, UncontrolledDropdown } from "reactstrap";

// const ResultsTab = ({ election, committees, candidates, results }) => {
//   return (
//     <div>
//       <Card>
//         <CardBody>
//           <div className="d-flex align-items-center mb-4">
//             <h5 className="card-title flex-grow-1">Results</h5>
//           </div>
//           <Row>
//             <Col>
//               <div className="table-responsive mt-4 mt-xl-0">
//                 <Table className="table-hover table-striped align-middle table-nowrap mb-0">
//                   <thead>
//                     <tr>
//                       <th>Rank</th>
//                       <th>Name</th>
//                       <th>Total</th>
//                       {committees.map((committee, index) => (
//                         <th key={index}>{committee.name}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {candidates.map((candidate, index) => (
//                       <tr key={index}>
//                         <td className="fw-medium">{index + 1}</td>
//                         <td>{candidate.name}</td>
//                         <td>{/* Compute and display the total votes for this candidate */}</td>
//                         {committees.map((committee, index) => (
//                           <td key={index}>
//                             <input 
//                                 type="number" 
//                                 defaultValue={
//                                     results[candidate.id] && results[candidate.id][committee.id] 
//                                         ? results[candidate.id][committee.id] 
//                                         : 0
//                                 }
//                             />
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Col>
//           </Row>
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default ResultsTab;
