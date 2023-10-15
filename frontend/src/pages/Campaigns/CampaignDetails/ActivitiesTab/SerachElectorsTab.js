// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import GuaranteesModal from "GuaranteesTab/GuaranteesModal";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaignGuarantee } from "store/actions";

// Others
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom component imports
import { ImageCircle, Loader, DeleteModal, TableContainer } from "Components/Common";
import { MemberRoleOptions, MemberStatusOptions } from "Components/constants";

// Reactstrap imports
import { Col, Row, Card, CardBody } from "reactstrap";

const GuaranteesTab = ({ campaignGuarantees }) => {
  const dispatch = useDispatch();

  const { isCampaignGuaranteeSuccess, error } = useSelector((state) => ({
    isCampaignGuaranteeSuccess: state.Campaigns.isCampaignGuaranteeSuccess,
    error: state.Campaigns.error,
  }));

  const [campaignGuarantee, setCampaignGuarantee] = useState([]);
  const [campaignGuaranteeList, setCampaignGuaranteeList] =
    useState(campaignGuarantees);

  useEffect(() => {
    setCampaignGuaranteeList(campaignGuarantees);
  }, [campaignGuarantees]);

  const [isEdit, setIsEdit] = useState(false);

  //Delete Election Member
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);

  // Toggle
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCampaignGuarantee(null);
    } else {
      setModal(true);
    }
  }, [modal]);

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

  // Add Dataa
  // handleCampaignGuaranteeClicks Function
  const handleCampaignGuaranteeClicks = () => {
    setCampaignGuarantee(""); // Changed from empty string to null
    setIsEdit(false);
    toggle();
  };

  // Update Data
  const handleCampaignGuaranteeClick = useCallback(
    (arg) => {
      const campaignGuarantee = arg;
      setCampaignGuarantee({
        id: campaignGuarantee.id,
        campaign_id: campaignGuarantee.campaign_id,
        user_id: campaignGuarantee.user_id,
        name: campaignGuarantee.name,
        role: campaignGuarantee.role,
        status: campaignGuarantee.status,
        notes: campaignGuarantee.notes,
      });

      setIsEdit(true);
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

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

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

  const columns = useMemo(() => {
    let cols = [
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
      {
        Header: "ID",
        Cell: (cellProps) => {
          return <p> {cellProps.row.original.id}</p>;
        },
      },
      {
        Header: "CID",
        Cell: (cellProps) => {
          return <p> {cellProps.row.original.civil}</p>;
        },
      },
      {
        Header: "Name",
        Cell: (cellProps) => {
          return <p> {cellProps.row.original.full_name}</p>;
        },
      },
      {
        Header: "Gender",
        Cell: (cellProps) => {
          return <p> {cellProps.row.original.gender}</p>;
        },
      },
      // {
      //   Header: "Status",
      //   accessor: "status",
      //   filterable: false,
      //   Cell: (cellProps) => {
      //     let badgeClass;
      //     let statusId = cellProps.row.original.status;
      //     let statusName;

      //     switch (statusId) {
      //       case 1:
      //         statusName = "active";
      //         badgeClass = "badge bg-success";
      //         break;
      //       case 2:
      //         statusName = "pending";
      //         badgeClass = "badge bg-warning";
      //         break;
      //       case 3:
      //         statusName = "inactive";
      //         badgeClass = "badge bg-danger";
      //         break;
      //       default:
      //         statusName = "unknown";
      //         badgeClass = "badge bg-primary";
      //         break;
      //     }

      //     return (
      //       <span className={`${badgeClass} text-uppercase`}>{statusName}</span>
      //     );
      //   },
      // },
      // {
      //   Header: "Notes",
      //   accessor: "notes",
      //   filterable: false,
      //   Cell: (cellProps) => {
      //     return <p>{cellProps.row.original.notes}</p>;
      //   },
      // },

      // Supervisors: Team Number, Guarantees (Total, Confirmed, Attended)
      // Guarantors: Guarantees (Total, Confirmed, Attended)
      // Attendands: Committee, Attendees
      // Sorter: Committee,
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <Link to="#" className="text-muted d-inline-block">
                  <i className="ri-phone-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit" title="Message">
                <Link to="#" className="text-muted d-inline-block">
                  <i className="ri-question-answer-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="View">
                <Link
                  to="#"
                  onClick={() => {
                    // console.log("Click event triggered");
                    // const campaignGuaranteeInfo = cellProps.row.original;
                    // setCampaignGuaranteeInfo(campaignGuaranteeInfo);
                    // console.log("campaignGuaranteeInfo", campaignGuaranteeInfo);
                  }}
                >
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link
                  className="edit-item-btn"
                  to="#"
                  onClick={() => {
                    const campaignGuarantee = cellProps.row.original;
                    handleCampaignGuaranteeClick(campaignGuarantee);
                  }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <Link
                  className="remove-item-btn"
                  onClick={() => {
                    const campaignGuarantee = cellProps.row.original;
                    onClickDelete(campaignGuarantee);
                  }}
                  to="#"
                >
                  <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ];

    console.log(
      "ActiveTab type:",
      typeof activeTab,
      "ActiveTab value:",
      activeTab
    );

    if (activeTab === "3") {
      const additionalCols = [
        {
          Header: "Guarantees",
          // accessor: "guarantees",
          filterable: false,
          Cell: (cellProps) => {
            return <p>guarantees</p>;
          },
        },
      ];

      cols = [...cols, ...additionalCols];
    }
    return cols;
  }, [handleCampaignGuaranteeClick, checkedAll, activeTab]);

  // // Export Modal
  // const [isExportCSV, setIsExportCSV] = useState(false);
  useEffect(() => {
    console.log("campaignGuaranteeList:", campaignGuaranteeList);
  }, [campaignGuaranteeList]);

  return (
    <React.Fragment>
      {/* <ExportCSVModal
            show={isExportCSV}
            onCloseClick={() => setIsExportCSV(false)}
            data={CampaignGuarantees}
          /> */}
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
      <GuaranteesModal
        modal={modal}
        setModal={setModal}
        isEdit={isEdit}
        toggle={toggle}
        campaignGuarantee={campaignGuarantee}
      />

      <Row>
        <Col lg={12}>
          <Card>
            <Card id="memberList">
              <CardBody className="pt-0">
                <div>
                  {campaignGuaranteeList && campaignGuaranteeList.length ? (
                    //  <TableHeader />
                    <TableContainer
                      //
                      // Header
                      isTableContainerHeader={true}
                      AddButtonText="Add New Member"
                      setDeleteModalMulti={setDeleteModalMulti}
                      setIsEdit={setIsEdit}
                      toggle={toggle}
                      isMultiDeleteButton={isMultiDeleteButton}
                      //
                      // Filters
                      isGlobalFilter={true}
                      preGlobalFilteredRows={true}
                      // isCampaignRoleFilter={true}
                      onTabChange={handleTabChange}
                      isFieldFilter={true}
                      SearchPlaceholder="Search for Election Candidates..."
                      //
                      // Data
                      columns={columns}
                      data={campaignGuaranteeList || []}
                      setCampaignGuaranteeList={setCampaignGuaranteeList}
                      customPageSize={50}
                      // TODO: to find out what is this for and how to be used with the table
                      // handleCampaignGuaranteeClick={handleCampaignGuaranteeClicks}
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
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default GuaranteesTab;
