import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";

import PropTypes from "prop-types";
import { useTable, useGlobalFilter, useAsyncDebounce, useSortBy, useFilters, useExpanded, usePagination, useRowSelect } from "react-table";
import { Table, Row, Col, Button, Input, CardBody, CardHeader, CardFooter } from "reactstrap";
import { CustomersGlobalFilter } from "../../Components/Common/GlobalSearchFilter";

import {
    ResetFilters,
    SearchFilter,
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

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
    SearchPlaceholder,
}) {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (
        <React.Fragment>
            <div className="col-xxl-3 col-sm-4">
                <form>
                    <Col>
                        <div className="search-box me-2 mb-2 d-inline-block col-12">
                            <input
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    onChange(e.target.value);
                                }}
                                id="search-bar-0"
                                type="text"
                                className="form-control search /"
                                placeholder={SearchPlaceholder}
                                value={value || ""}
                            />
                            <i className="bx bx-search-alt search-icon"></i>
                        </div>
                    </Col>
                </form>
            </div>
        </React.Fragment>
    );
}

const TableContainerFilters = ({

    // Global Filter -------------------------
    setGlobalFilter,
    filters,
    setFilters,
    // Upper Filters -------------------------
    isElectionCategoryFilter,
    isCampaignRankFilter,

    // Filters -------------------------
    SearchPlaceholder,
    isSearchFilter,
    searchField,
    isStatusFilter,
    isPriorityFilter,
    isCandidateGenderFilter,
    isGuaranteeGenderFilter,
    isGuaranteeAttendanceFilter,
    isAttendeesGenderFilter,
    isCommitteeFilter,
    isGuaranteeStatusFilter,
    isGuarantorFilter,
    isResetFilters,
    isTestFilter,
    isGlobalSearch,
    customPageSize,

    // Constants
    setIsEdit,
    toggle,
    setDeleteModalMulti,
    campaignMember,
    setElectionList,
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
                        {/* {isGlobalFilter && ( */}
                        <GlobalFilter
                            preGlobalFilteredRows={preGlobalFilteredRows}
                            // globalFilter={state.globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            // isElectionListFilter={isElectionListFilter}
                            SearchPlaceholder={SearchPlaceholder}
                        />
                        {/* )} */}
                        {isSearchFilter && (
                            <SearchFilter filters={filters} setFilters={setFilters} searchField={searchField} />
                        )}

                        {isStatusFilter && (
                            <StatusFilter filters={filters} setFilters={setFilters} />
                        )}
                        {isPriorityFilter && (
                            <PriorityFilter filters={filters} setFilters={setFilters} />
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
                            />
                        )}
                    </div>
                </div>
            </Row>
        </React.Fragment>
    )
};
export default TableContainerFilters
