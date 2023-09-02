import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteCampaignGuarantee,
  updateCampaignGuarantee,
} from "../../../store/actions";

// Component imports
import { Col, Row, Card, CardHeader, CardBody } from "reactstrap";
import {
  Loader,
  DeleteModal,
  TableContainer,
} from "../../../Components/Common";
import CampaignGuaranteesModal from "./Modals/CampaignGuaranteesModal";
import { GuaranteeStatusOptions } from "../../../Components/constants";

// Utility imports
import { toast, ToastContainer } from "react-toastify";

// CSS imports
import "react-toastify/dist/ReactToastify.css";

const GuaranteesTab = () => {
  const dispatch = useDispatch();

  // --------------- States ---------------
  const {
    campaignGuarantees,
    campaignMembers,
    isCampaignGuaranteeSuccess,
    error,
  } = useSelector((state) => ({
    campaignGuarantees: state.Campaigns.campaignGuarantees,
    campaignMembers: state.Campaigns.campaignMembers,
    isCampaignGuaranteeSuccess: state.Campaigns.isCampaignGuaranteeSuccess,
    error: state.Campaigns.error,
  }));

  // CampaignGuarantees Constants
  const [campaignGuarantee, setCampaignGuarantee] = useState(null);
  const [campaignGuaranteeList, setCampaignGuaranteeList] =
    useState(campaignGuarantees);

  useEffect(() => {
    setCampaignGuaranteeList(campaignGuarantees);
  }, [campaignGuarantees]);

  // Delete Modal Constants
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  // Delete Multiple Constants
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  // Delete Data
  const handleDeleteCampaignGuarantee = () => {
    if (campaignGuarantee) {
      dispatch(deleteCampaignGuarantee(campaignGuarantee.id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (campaignGuarantee) => {
    setCampaignGuarantee(campaignGuarantee);
    setDeleteModal(true);
  };

  // Modal Constants
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggle = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleCampaignGuaranteeClick = useCallback(
    (arg, modalMode) => {
      const campaignGuarantee = arg;
      setCampaignGuarantee({
        id: campaignGuarantee.id,
        member: campaignGuarantee.member,
        campaign: campaignGuarantee.campaign,
        civil: campaignGuarantee.civil,
        full_name: campaignGuarantee.full_name,
        box_no: campaignGuarantee.box_no,
        member_no: campaignGuarantee.member_no,
        enrollment_date: campaignGuarantee.enrollment_date,
        mobile: campaignGuarantee.mobile,
        status: campaignGuarantee.status,
        notes: campaignGuarantee.notes,
      });

      // Set the modalMode state here
      setModalMode(modalMode);
      toggle();
    },
    [toggle]
  );

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(
      ".campaignGuaranteeCheckBox"
    );

    if (checkall.checked) {
      checkedEntry.forEach((checkedEntry) => {
        checkedEntry.checked = true;
      });
    } else {
      checkedEntry.forEach((checkedEntry) => {
        checkedEntry.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(deleteCampaignGuarantee(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(
      ".campaignGuaranteeCheckBox:checked"
    );
    checkedEntry.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(checkedEntry);
  };

  const [activeTab, setActiveTab] = useState("0");

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const getGenderIcon = (gender) => {
    if (gender === 2) {
      return <i className="mdi mdi-circle align-middle text-danger me-2"></i>;
    } else if (gender === 1) {
      return <i className="mdi mdi-circle align-middle text-info me-2"></i>;
    }
    return null;
  };

  const memberName = (campaignMembers || []).reduce((acc, member) => {
    acc[member.id] = member;
    return acc;
  }, {});
  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="campaignGuaranteeCheckBox form-check-input"
              value={cellProps.row.original.id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "id",
      },
      // {
      //   Header: "ID",
      //   Cell: (cellProps) => {
      //     return <p> {cellProps.row.original.id}</p>;
      //   },
      // },
      {
        Header: "Name",
        Cell: (cellProps) => {
          return (
            <div>
              {getGenderIcon(cellProps.row.original.gender)}
              <b>{cellProps.row.original.full_name}</b>
              <br />
              {cellProps.row.original.civil}
            </div>
          );
        },
      },
      // {
      //   Header: "CID",
      //   Cell: (cellProps) => {
      //     return <p> {cellProps.row.original.civil}</p>;
      //   },
      // },
      {
        Header: "Mobile",
        accessor: "mobile",
        filterable: false,
        Cell: (cellProps) => {
          return <p>{cellProps.row.original.mobile}</p>;
        },
      },
      {
        Header: "Attended",
        accessor: "attended",
        filterable: false,
        Cell: (cellProps) => {
          if (cellProps.row.original.attended) {
            return <p style={{ color: "green" }}>✔️</p>; // Green check circle
          } else {
            return <p style={{ color: "red" }}>❌</p>; // Red X
          }
        },
      },

      {
        Header: "Status",
        accessor: "status",
        filterable: false,
        Cell: (cellProps) => {
          const statusId = cellProps.row.original.status;

          // Find the corresponding status object in the GuaranteeStatusOptions
          const statusOption = GuaranteeStatusOptions.find(
            (option) => option.id === statusId
          );

          if (statusOption) {
            return (
              <span className={`${statusOption.badgeClass} text-uppercase`}>
                {statusOption.name}
              </span>
            );
          } else {
            // Fallback for unknown statuses
            return (
              <span className="badge bg-primary text-uppercase">Unknown</span>
            );
          }
        },
      },
      {
        Header: "Guarantor",
        accessor: "member",
        filterable: false,
        Cell: (cellProps) => {
          const memberId = cellProps.row.original.member;

          if (memberId === null) {
            return (
              <p className="text-danger">
                <strong>N/A</strong>
              </p>
            );
          }

          const member = campaignMembers.find(
            (member) => member.id === memberId
          );
          return (
            <p className="text-success">
              <strong>{member ? member.user.name : "Not Found"}</strong>
            </p>
          );
        },
      },

      // s: Team Number, Guarantees (Total, Confirmed, Attended)
      // Guarantors: Guarantees (Total, Confirmed, Attended)
      // Attendands: Committee, Attendees
      // Sorter: Committee,

      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <div className="list-inline hstack gap-2 mb-0">
              <button
                to="#"
                className="btn btn-sm btn-soft-warning edit-list"
                onClick={() => {
                  const campaignGuarantee = cellProps.row.original;
                  handleCampaignGuaranteeClick(
                    campaignGuarantee,
                    "GuaranteeViewModal"
                  );
                }}
              >
                <i className="ri-eye-fill align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-info edit-list"
                onClick={() => {
                  const campaignGuarantee = cellProps.row.original;
                  handleCampaignGuaranteeClick(
                    campaignGuarantee,
                    "GuaranteeUpdateModal"
                  );
                }}
              >
                <i className="ri-pencil-fill align-bottom" />
              </button>
              <button
                to="#"
                className="btn btn-sm btn-soft-danger remove-list"
                onClick={() => {
                  const campaignGuarantee = cellProps.row.original;
                  onClickDelete(campaignGuarantee);
                }}
              >
                <i className="ri-delete-bin-5-fill align-bottom" />
              </button>
            </div>
          );
        },
      },
    ],
    [handleCampaignGuaranteeClick, checkedAll]
  );

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCampaignGuarantee}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />

      <CampaignGuaranteesModal
        modal={isModalVisible}
        modalMode={modalMode}
        toggle={toggle}
        campaignGuarantee={campaignGuarantee}
      />
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <Row className="mb-2">
                <h4>
                  <b>Campaign Guarantees</b>
                </h4>
              </Row>
            </CardHeader>
            <CardBody className="pt-0">
              <div>
                {campaignGuaranteeList ? (
                  //  <TableHeader />
                  <TableContainer
                    // Data
                    columns={columns}
                    data={campaignGuaranteeList || []}
                    customPageSize={50}
                    // Header
                    setDeleteModalMulti={setDeleteModalMulti}
                    setCampaignGuaranteeList={setCampaignGuaranteeList}
                    toggle={toggle}
                    isMultiDeleteButton={isMultiDeleteButton}
                    // Filters
                    preGlobalFilteredRows={true}
                    isGlobalFilter={true}
                    isGuaranteeGenderFilter={true}
                    isGuaranteeAttendanceFilter={true}
                    isGuaranteeStatusFilter={true}
                    isGuarantorFilter={true}
                    onTabChange={handleTabChange}
                    SearchPlaceholder="Search for Campaign Guarantees..."
                    // Styling
                    className="custom-header-css"
                    divClass="table-responsive table-card mb-2"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light"
                  />
                ) : (
                  <Loader error={error} />
                )}
              </div>
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default GuaranteesTab;
