import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { Row } from "reactstrap";

import {
    GlobalFilter,
    ResetFilters,
    StatusFilter,
    PriorityFilter,
    ElectionCategoryFilter,
    CandidateGenderFilter,
    MemberRankFilter,
    GuaranteeGenderFilter,
    AttendeeGenderFilter,
    GuaranteeStatusFilter,
    GuarantorFilter,
    ElectionCommitteeFilter,
    GuaranteeAttendanceFilter,
} from "./Filters";



const TableContainerFilters = ({

    // Tab Filters -------------------------
    isElectionCategoryFilter,
    isCampaignRankFilter,

    // Global Filter -------------------------
    isGlobalFilter,

    globalFilter,

    // Select Filters -------------------------
    isStatusFilter,
    isPriorityFilter,
    isCandidateGenderFilter,
    isMemberRankFilter,
    isGuaranteeGenderFilter,
    isGuaranteeAttendanceFilter,
    isAttendeesGenderFilter,
    isCommitteeFilter,
    isGuaranteeStatusFilter,
    isGuarantorFilter,
    isResetFilters,
    isTestFilter,
    isGlobalSearch,


    // Settings
    filters,
    setFilters,
    customPageSize,
    SearchPlaceholder,

    // Constants
    setCampaignMemberList,
    setElectionCandidateList,
    setCampaignGuaranteeList,
    setElectionAttendeeList,

    // Actions
    onTabChange,

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
    const [activeTab, setActiveTab] = useState("0");

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
                        {isMemberRankFilter && (
                            <MemberRankFilter
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
                                setFilters={setFilters} />
                        )}
                        {isPriorityFilter && (
                            <PriorityFilter
                                filters={filters}
                                setFilters={setFilters} />
                        )}


                        {isCandidateGenderFilter && (
                            <CandidateGenderFilter
                                setElectionCandidateList={setElectionCandidateList}
                            />
                        )}
                        {isGuaranteeAttendanceFilter && (
                            <GuaranteeAttendanceFilter
                                setCampaignGuaranteeList={setCampaignGuaranteeList}
                            />
                        )}
                        {isGuaranteeGenderFilter && (
                            <GuaranteeGenderFilter
                                setCampaignGuaranteeList={setCampaignGuaranteeList}
                            />
                        )}
                        {isAttendeesGenderFilter && (
                            <AttendeeGenderFilter
                                setElectionAttendeeList={setElectionAttendeeList}
                            />
                        )}
                        {isCommitteeFilter && (
                            <ElectionCommitteeFilter
                                setElectionAttendeeList={setElectionAttendeeList}
                            />
                        )}
                        {isGuaranteeStatusFilter && (
                            <GuaranteeStatusFilter
                                setCampaignGuaranteeList={setCampaignGuaranteeList}
                            />
                        )}
                        {isGuarantorFilter && (
                            <GuarantorFilter
                                setCampaignGuaranteeList={setCampaignGuaranteeList}
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
