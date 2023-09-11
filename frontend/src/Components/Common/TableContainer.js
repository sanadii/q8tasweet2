import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useTable, useGlobalFilter, useAsyncDebounce, useSortBy, useFilters, useExpanded, usePagination, useRowSelect } from "react-table";
import { Table, Row, Col, Button, Input, CardBody, CardHeader, CardFooter } from "reactstrap";

import {
  DefaultColumnFilter,    // Can be removed, review the codes that can be used
} from "./Filters";

import { TableContainerHeader, TableContainerFooter, TableContainerFilters } from "../Common";

// Define a default UI for filtering


const TableContainer = ({
  // Global Header -------------------------
  isTableContainerFilter,
  isElectionCategoryFilter,
  isCampaignRankFilter,



  // Constants, going where?
  campaignMember,
  setElectionList,
  setCampaignMemberList,
  setElectionCandidateList,
  setCampaignGuaranteeList,
  setElectionAttendeeList,

  // Filters -------------------------
  isGlobalFilter,
  isSearchFilter,
  isStatusFilter,
  isPriorityFilter,
  isMemberRankFilter,
  isCandidateGenderFilter,
  isGuaranteeGenderFilter,
  isGuaranteeAttendanceFilter,
  isAttendeesGenderFilter,
  isCommitteeFilter,
  isGuaranteeStatusFilter,
  isGuarantorFilter,
  isResetFilters,
  isTestFilter,

  // Settings
  filters,
  setFilters,
  customPageSize,
  SearchPlaceholder,

  // Actions
  onTabChange,



  // Other Filters
  isCustomerFilter,

  // Table -------------------------
  columns,
  data,

  // Table Styling
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,

}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        selectedRowIds: 0,
        sortBy: [
          {
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " " : "") : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };
  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  return (
    <Fragment>
      {isTableContainerFilter && (
        <CardBody>
          <TableContainerFilters

            isGlobalFilter={isGlobalFilter}
            // Upper Filters -------------------------
            isElectionCategoryFilter={isElectionCategoryFilter}
            isCampaignRankFilter={isCampaignRankFilter}

            filters={filters}
            setFilters={setFilters}

            // Filters -------------------------
            SearchPlaceholder={SearchPlaceholder}
            isSearchFilter={isSearchFilter}
            isStatusFilter={isStatusFilter}
            isPriorityFilter={isPriorityFilter}
            isCandidateGenderFilter={isCandidateGenderFilter}
            isGuaranteeGenderFilter={isGuaranteeGenderFilter}
            isGuaranteeAttendanceFilter={isGuaranteeAttendanceFilter}
            isAttendeesGenderFilter={isAttendeesGenderFilter}
            isMemberRankFilter={isMemberRankFilter}
            isCommitteeFilter={isCommitteeFilter}
            isGuaranteeStatusFilter={isGuaranteeStatusFilter}
            isGuarantorFilter={isGuarantorFilter}
            isResetFilters={isResetFilters}
            isTestFilter={isTestFilter}

            // Other Filters
            isCustomerFilter={isCustomerFilter}

            // Constant  -------------------------
            campaignMember={campaignMember}
            setElectionList={setElectionList}
            setCampaignMemberList={setCampaignMemberList}
            setElectionCandidateList={setElectionCandidateList}
            setCampaignGuaranteeList={setCampaignGuaranteeList}
            setElectionAttendeeList={setElectionAttendeeList}

            // Actions
            onTabChange={onTabChange}

            // From useTable
            preGlobalFilteredRows={preGlobalFilteredRows}
            setPageSize={setPageSize}
            gotoPage={gotoPage}
          />
        </CardBody>
      )}



      <div className="card-body pt-0">
        <div className={divClass}>
          <Table hover {...getTableProps()} className={tableClass}>
            <thead className={theadClass}>
              {headerGroups.map((headerGroup) => (
                <tr
                  className={trClass}
                  key={headerGroup.id}
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      key={column.id}
                      className={thClass}
                      {...column.getSortByToggleProps()}
                    >
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                      {/* <Filter column={column} /> */}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map((cell) => {
                        return (
                          <td key={cell.id} {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      <Row className="justify-content-md-end justify-content-center align-items-center p-2">
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              color="primary"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              {"<"}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            type="number"
            min={1}
            style={{ width: 70 }}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={onChangeInInput}
          />
        </Col>

        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
              {">"}
            </Button>
          </div>
        </Col>
      </Row>
      <CardFooter>
        <TableContainerFooter />
      </CardFooter>
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
