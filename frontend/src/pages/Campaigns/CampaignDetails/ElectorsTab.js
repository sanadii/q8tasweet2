import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getElectors, addNewCampaignGuarantee, addNewCampaignAttendee } from "../../../store/actions";
import SimpleBar from "simplebar-react";
import { Loader, TableContainer } from "../../../Components/Common";
import { campaignSelector, electorSelector } from 'Selectors';

import CampaignElectorsModal from "./Modals/CampaignElectorsModal";

// Reactstrap (UI) imports
import { Col, Row, Card, CardHeader, CardBody, Label, Input } from "reactstrap";

export const ElectorsTab = () => {
  const dispatch = useDispatch();

  const { currentCampaignMember, campaignDetails, campaignMembers, campaignGuarantees, campaignAttendees, isCampaignGuaranteeSuccess, error } = useSelector(campaignSelector);
  const { electors } = useSelector(electorSelector);
  const [campaignGuaranteeList, setCampaignGuaranteeList] = useState(campaignGuarantees);

  useEffect(() => {
    setCampaignGuaranteeList(campaignGuarantees);
  }, [campaignGuarantees]);

  const [campaignAttendeeList, setCampaignAttendeeList] = useState(campaignAttendees);

  useEffect(() => {
    setCampaignGuaranteeList(campaignAttendees);
  }, [campaignAttendees]);

  // Add New CampaignGuarantee Search & Filter
  const [searchElectorInput, setSearchElectorInput] = useState("");
  const [electorList, setElectorList] = useState(electors);

  useEffect(() => {
    setElectorList(electors);
  }, [electors]);

  const handleSearch = (event) => {
    event.preventDefault();

    const searchParameters = {
      searchInput: searchElectorInput,
    };

    dispatch(getElectors(searchParameters));
  };

  const [campaignGuarantee, setCampaignGuarantee] = useState(null); // initialized to null

  const guarantorMembers = campaignMembers.filter(
    (member) => member.rank === 3 || member.rank === 4
  );

  // Modal Constants
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggle = useCallback(() => {
    setIsModalVisible(prevIsModalVisible => !prevIsModalVisible);
  }, []);


  // View Elector Info
  const [elector, setElector] = useState(null);

  const handleElectorClick = useCallback(
    (arg, modalMode) => {
      const elector = arg;
      setElector({
        // Elector Fields
        civil: elector.civil,
        campaignId: campaignDetails.id,
        gender: elector.gender,
        full_name: elector.full_name,
        status: elector.status,
        notes: elector.notes,
      });
      // Set the modalMode state here
      setModalMode(modalMode);
      toggle();
    },
    [toggle, campaignDetails.id]
  );

  const getGenderIcon = (gender) => {
    if (gender === 2) {
      return <i className="mdi mdi-circle align-middle text-danger me-2"></i>;
    } else if (gender === 1) {
      return <i className="mdi mdi-circle align-middle text-info me-2"></i>;
    }
    return null;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        Cell: (cellProps) => {
          return (
            <p>
              {getGenderIcon(cellProps.row.original.gender)}
              <b>{cellProps.row.original.full_name}</b>
            </p>
          );
        },
      },
      {
        Header: "CID",
        Cell: (cellProps) => {
          return <p> {cellProps.row.original.civil}</p>;
        },
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <div className="list-inline hstack gap-2 mb-0">
              <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                  const elector = cellProps.row.original;
                  handleElectorClick(elector, "CampaignElectorViewModal");
                }}
              >
                <i className="ri-eye-fill align-bottom" />
              </button>
              {/* <button
                to="#"
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => {
                  const elector = cellProps.row.original;
                  // onClickDelete(elector);
                }}
              >
                <i className="ri-delete-bin-5-fill align-bottom" />
              </button> */}
            </div>
          );
        },
      },
      {
        Header:
          currentCampaignMember.rank >= 2 && currentCampaignMember.rank <= 4
            ? "Add Guarantee"
            : "Add Attendee",
        Cell: (cellProps) => {
          return (
            <div className="flex-shrink-0">
              {currentCampaignMember.rank >= 2 &&
                currentCampaignMember.rank <= 4 ? (
                campaignGuarantees.some(
                  (item) => item.civil === cellProps.row.original.civil
                ) ? (
                  <span className="text-success">تمت الإضافة</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    id="add-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      const newCampaignGuarantee = {
                        campaign: campaignDetails.id,
                        member: currentCampaignMember.id,
                        elector: cellProps.row.original.civil,
                        status: 1,
                      };
                      dispatch(addNewCampaignGuarantee(newCampaignGuarantee));
                    }}
                  >
                    إضف للمضامين
                  </button>
                )
              ) : electors.some(
                (item) => item.civil === cellProps.row.original.civil
              ) ? (
                <span className="text-success">تم التحضير</span>
              ) : (
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  id="add-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    const newCampaignAttendee = {
                      user: currentCampaignMember.user.id,
                      election: campaignDetails.election.id,
                      committee: currentCampaignMember.committee,
                      elector: cellProps.row.original.civil,
                      status: 1,
                    };
                    dispatch(addNewCampaignAttendee(newCampaignAttendee));
                  }}
                >
                  تسجيل حضور
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [
      handleElectorClick,
      campaignDetails.election.id,
      campaignDetails.id,
      campaignGuarantees,
      currentCampaignMember.committee,
      currentCampaignMember.id,
      currentCampaignMember.rank,
      currentCampaignMember.user.id,
      dispatch,
      electors,
    ]);
  return (
    <React.Fragment>
      <CampaignElectorsModal
        modal={isModalVisible}
        modalMode={modalMode}
        toggle={toggle}
        elector={elector}
      />
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <Row className="mb-2">
                <h4>
                  <b>البحث - الناخبين</b>
                </h4>
              </Row>
            </CardHeader>
            <CardBody className="border border-dashed border-end-0 border-start-0">
              <form onSubmit={handleSearch}>
                <Row className="mb-3">
                  <div className="d-flex align-items-center ">
                    <div className="col d-flex g-2 row">
                      <Col xxl={3} md={6}>
                        <Input
                          type="text"
                          value={searchElectorInput}
                          onChange={(e) =>
                            setSearchElectorInput(e.target.value)
                          }
                          placeholder="Search by Civil ID or Name..."
                        />
                      </Col>
                      <Col xxl={3} md={6}>
                        <button type="submit" className="btn btn-primary">
                          إبحث
                        </button>
                      </Col>
                    </div>
                  </div>
                </Row>
              </form>
              {electorList && electorList.length ? (
                <TableContainer
                  columns={columns}
                  data={electorList || []}
                  customPageSize={50}
                  className="custom-header-css"
                  divClass="table-responsive table-card mb-2"
                  tableClass="align-middle table-nowrap"
                  theadClass="table-light"
                />
              ) : (
                <p>لا شيء لعرضه، ابدأ أو قم بتحسين بحثك</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ElectorsTab;
