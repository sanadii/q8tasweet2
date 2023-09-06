import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useTable, useGlobalFilter, useAsyncDebounce, useSortBy, useFilters, useExpanded, usePagination, useRowSelect } from "react-table";
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

import { CustomersGlobalFilter } from "../../Components/Common/GlobalSearchFilter";
import TableContainerHeader from "./TableContainerHeader";
import TableContainerFooter from "./TableContainerFooter";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isCustomerFilter,
  isContactsFilter,
  isCompaniesFilter,

  isMultiDeleteButton,
  isNFTRankingFilter,
  isProductsFilter,
  SearchPlaceholder,
  GlobalHeader,
  AddButtonText,
  handleItemClick,
  modal,
  setModal,
  setModalMode,
  handleAddButtonClick,
  toggle,
  campaignMember,
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
            <div
              className={
                isProductsFilter ||
                  isContactsFilter ||
                  isCompaniesFilter ||
                  isNFTRankingFilter
                  ? "search-box me-2 mb-2 d-inline-block"
                  : "search-box me-2 mb-2 d-inline-block col-12"
              }
            >
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
            {isCustomerFilter && <CustomersGlobalFilter />}
          </Col>
        </form>
      </div>
    </React.Fragment>
  );
}

const TableContainer = ({
  // Global Header -------------------------
  isGlobalHeader,
  isElectionHeader,
  isElectionCategoryFilter,
  isCampaignRankFilter,
  SearchPlaceholder,
  GlobalHeaderTitle,

  // Button
  isAddButton,
  AddButtonText,
  handleItemClick,

  // Actions
  handleAddButtonClick,
  handleEntryClick,
  onTabChange,

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
  isMultiDeleteButton,

  // Filters -------------------------
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

  // Other Filters
  isCustomerFilter,

  // Table -------------------------
  columns,
  data,
  isGlobalSearch,
  isGlobalFilter,

  // Table Styling
  customPageSize,
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
    setGlobalFilter,
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
      {isGlobalHeader && (

        <CardHeader>
          <Row>
            <TableContainerHeader
              GlobalHeaderTitle={GlobalHeaderTitle}
              AddButtonText={AddButtonText}
              handleEntryClick={handleEntryClick}
              handleAddButtonClick={handleAddButtonClick}
              onTabChange={onTabChange}
            />
          </Row>
          {/* <Row>
            <GlobalFilter />
          </Row> */}
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
        </CardHeader>
      )}
      {isGlobalFilter && (
        <CardBody className="border border-dashed border-end-0 border-start-0">
          <Row className="mb-3">
            <div className="d-flex align-items-center ">
              <div className="col d-flex g-2 row">
                {isGlobalSearch && (
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
                )}
                {isGlobalFilter && (
                  <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    isCustomerFilter={isCustomerFilter}
                    // isElectionListFilter={isElectionListFilter}
                    SearchPlaceholder={SearchPlaceholder}
                  />
                )}
                {isStatusFilter && (
                  <StatusFilter setElectionList={setElectionList} />
                )}
                {isPriorityFilter && (
                  <PriorityFilter setElectionList={setElectionList} />
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
                {isResetFilters && <ResetFilters />}
              </div>
            </div>
          </Row>
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
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
