import { Table, Row, Col, Button, Input, CardBody, CardHeader } from "reactstrap";
import {
    Filter,
    DefaultColumnFilter,    // Can be removed, review the codes that can be used
    ResetFilters,
    StatusFilter,
    PriorityFilter,
    ElectionCategoryFilter,
    CandidateGenderFilter,
    CampaignRankFilter,
    GuaranteeGenderFilter,
    AttendeeGenderFilter,
    GuaranteeStatusFilter,
    GuarantorFilter,
    ElectionCommitteeFilter,
    GuaranteeAttendanceFilter,
} from "./Filters";

const GlobalHeader = ({
    // Title
    GlobalHeaderTitle,

    // Add Button
    AddButtonText,
    handleEntryClick,
    isAddButton,
    handleAddButtonClick,

    // Delete Button
    isMultiDeleteButton,
    setDeleteModalMulti,

}) => {
    return (
        <CardHeader>
            <Row className="g-4 mb-4">
                <div className="d-flex align-items-center">
                    <Col>
                        <h4>
                            <b>{GlobalHeaderTitle}</b>
                        </h4>
                    </Col>
                    <div className="flex-shrink-0">
                        <div className="d-flex flex-wrap gap-2">
                            {isAddButton ? (
                                <Button
                                    type="button"
                                    className="btn btn-primary add-btn me-1"
                                    onClick={() => {
                                        handleEntryClick();
                                    }}
                                >
                                    <i className="mdi mdi-plus-circle-outline me-1" />
                                    {AddButtonText}
                                </Button>
                            ) : (
                                <Button
                                    className="btn btn-primary add-btn me-1"
                                    onClick={() => {
                                        handleAddButtonClick("AddModal");
                                    }}
                                >
                                    <i className="ri-add-line align-bottom me-1"></i>
                                    {AddButtonText}
                                </Button>
                            )}
                            {isMultiDeleteButton && (
                                <button
                                    className="btn btn-soft-danger"
                                    onClick={() => setDeleteModalMulti(true)}
                                >
                                    <i className="ri-delete-bin-2-line"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Row>

        </CardHeader>

    )
}


const GlobalFilter = ({
    onTabChange,
    isElectionCategoryFilter,
    setElectionList,

    isCampaignRankFilter,
    setCampaignMemberList
}) => {

    return (
        <Row>
            <div className="d-flex align-items-center ">
                <div className="col">
                    {isElectionCategoryFilter && (
                        <ElectionCategoryFilter setElectionList={setElectionList} />
                    )}
                    {isCampaignRankFilter && (
                        <CampaignRankFilter
                            setCampaignMemberList={setCampaignMemberList}
                            onTabChange={onTabChange}
                        />
                    )}
                </div>
                <div className="flex-shrink-0"></div>
            </div>
        </Row>
    )
}

const GlobalFooter = ({ }) => {
}

export {
    GlobalHeader,
    GlobalFilter,
    GlobalFooter,
}