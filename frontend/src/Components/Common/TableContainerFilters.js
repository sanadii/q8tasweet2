import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { Row } from "reactstrap";

// Campaign Filters
import MemberRoleFilter from "./Filters/MemberRoleFilter";
import ElectionCategoryFilter from "./Filters/ElectionCategoryFilter";
import GuaranteeStatusFilter from "./Filters/GuaranteeStatusFilter";
import GuarantorFilter from "./Filters/GuarantorFilter";
import GuaranteeAttendanceFilter from "./Filters/GuaranteeAttendanceFilter";
import CandidateGenderFilter from "./Filters/CandidateGenderFilter";

// General Filters
import GlobalFilter from "./Filters/GlobalFilter";
import GenderFilter from "./Filters/GenderFilter";
import ElectionCommitteeFilter from "./Filters/ElectionCommitteeFilter";
import PriorityFilter from "./Filters/PriorityFilter";
import StatusFilter from "./Filters/StatusFilter";
import ResetFilters from "./Filters/ResetFilters";
import DefaultColumnFilter from "./Filters/DefaultColumnFilter";
import SearchFilter from "./Filters/SearchFilter";


const TableContainerFilters = ({

    // Tab Filters----------
    isElectionCategoryFilter,
    isCampaignRoleFilter,

    // Global Filter----------
    isGlobalFilter,

    globalFilter,

    // Select Filters----------
    isStatusFilter,
    isPriorityFilter,
    isCandidateGenderFilter,
    isMemberRoleFilter,
    isGenderFilter,
    isGuaranteeAttendanceFilter,
    isAttendeesGenderFilter,
    isCommitteeFilter,
    isGuaranteeStatusFilter,
    isGuarantorFilter,
    isResetFilters,
    isTestFilter,
    isGlobalSearch,

    // Settings
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    customPageSize,
    SearchPlaceholder,

    // Constants
    setCampaignMemberList,
    setElectionCandidateList,
    setCampaignGuaranteeList,

    // From useTable
    preGlobalFilteredRows,
    setPageSize,
    gotoPage,
}) => {
    const onChangeInSelect = (event) => {
        setPageSize(Number(event.target.value));
    };
    const onChangeInInput = (event) => {
        const page = event.target.value ? Number(event.target.value) - 1 : 0;
        gotoPage(page);
    };

    // Fetching the elections (assuming you have them in some state or context)
    const elections = useSelector((state) => state.Elections.elections);


    // Then, use 'filteredElections' to render your table or list.
    // const [activeTab, setActiveTab] = useState("0");

    return (
        <React.Fragment>
            <Row className="g-4 mb-4">
                <div className="d-flex align-items-center ">
                    <div className="col">
                        {isElectionCategoryFilter && (
                            <ElectionCategoryFilter
                                setFilters={setFilters}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        )}
                        {isMemberRoleFilter && (
                            <MemberRoleFilter
                                setFilters={setFilters}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
                        )}
                    </div>
                    <div className="flex-shrink-0"></div>
                </div>
            </Row>

            <Row className="g-4 mb-4">
                <div className="d-flex align-items-center ">
                    <div className="col d-flex g-2 row">
                        {/* {isGlobalSearch && (
                            <select
                                className="form-select"
                                value={pageSize}
                                onChange={onChangeInSelect}
                            >
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        )} */}
                        {isGlobalFilter && (
                            <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                setFilters={setFilters}
                                SearchPlaceholder={SearchPlaceholder}
                                globalFilter={filters?.global}

                            />
                        )}

                        {isStatusFilter && (
                            <StatusFilter
                                filters={filters}
                                setFilters={setFilters}
                            />
                        )}
                        {isPriorityFilter && (
                            <PriorityFilter
                                filters={filters}
                                setFilters={setFilters}
                            />
                        )}


                        {isCandidateGenderFilter && (
                            <CandidateGenderFilter
                                setElectionCandidateList={setElectionCandidateList}
                            />
                        )}
                        {isGuaranteeAttendanceFilter && (
                            <GuaranteeAttendanceFilter
                                filters={filters}
                                setFilters={setFilters}
                            />
                        )}
                        {isGenderFilter && (
                            <GenderFilter
                                filters={filters}
                                setFilters={setFilters}
                            />
                        )}
                        {/* {isAttendeesGenderFilter && (
                            <AttendeeGenderFilter
                                filters={filters}
                                setFilters={setFilters}
                            />
                        )} */}
                        {isCommitteeFilter && (
                            <ElectionCommitteeFilter
                                filters={filters}
                                setFilters={setFilters}
                            />
                        )}
                        {isGuaranteeStatusFilter && (
                            <GuaranteeStatusFilter
                                filters={filters}
                                setFilters={setFilters}
                            />
                        )}
                        {isGuarantorFilter && (
                            <GuarantorFilter
                                filters={filters}
                                setFilters={setFilters}
                            />
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        {isResetFilters && (
                            <ResetFilters
                                setFilters={setFilters}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                globalFilter={globalFilter}
                            />
                        )}
                    </div>
                </div>
            </Row>
        </React.Fragment>
    )
};
export default TableContainerFilters
