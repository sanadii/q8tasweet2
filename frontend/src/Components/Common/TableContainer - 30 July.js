import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useRowSelect,
} from "react-table";

import { Table, Row, Col, Button, Input, CardBody } from "reactstrap";
import { Filter, DefaultColumnFilter, SelectColumnFilter } from "./filters";
import {
  ElectionListGlobalFilter,
} from "../../Components/Common/GlobalSearchFilter";

import { ElectionSelectionFilter } from "./SelectionFilter";


// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isElectionListFilter,
  isTaskListFilter,

  SearchPlaceholder,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <React.Fragment>
      <CardBody className="border border-dashed border-end-0 border-start-0">
        <form>
          <Row className="g-3">
            <Col sm={3}>
              <div className="search-box me-2 mb-2 d-inline-block col-12">
                <input
                  onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                  }}
                  id="search-bar-0"
                  type="text"
                  className="form-control search"
                  placeholder={SearchPlaceholder}
                  value={value || ""}
                />
                <i className="bx bx-search-alt search-icon"></i>
              </div>
            </Col>
            {isElectionListFilter && (
              <ElectionListGlobalFilter
                // globalFilter={globalFilter}
                // setGlobalFilter={setGlobalFilter}
              />
            )}
          </Row>
        </form>
      </CardBody>
    </React.Fragment>
  );
}

function SelectionFilter({
  selectionFilter,
  setSelectionFilter,
  isElectionSelectionFilter,
}) {
  const [value, setValue] = React.useState(selectionFilter);
  const onChange = useAsyncDebounce((value) => {
    setSelectionFilter(value || undefined);
  }, 200);

  return (
    <React.Fragment>
      <CardBody className="border border-dashed border-end-0 border-start-0">
      </CardBody>

    </React.Fragment>
  );
}

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isSelectionFilter,
  isColumnFilter, // Add the prop here

  isElectionListFilter,
  isTaskListFilter,

  isElectionSelectionFilter,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  SearchPlaceholder,
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
    setSelectionFilter,
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
      <Row>
        <p>Row Top</p>
      </Row>
      <Row className="mb-3">
        <p>isGlobalFilter</p>
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            isTaskListFilter={isTaskListFilter}
            isElectionListFilter={isElectionListFilter}
            SearchPlaceholder={SearchPlaceholder}
          />
        )}

        {/* {isSelectionFilter && (
          <SelectionFilter
            selectionFilter={state.selectionFilter}
            setSelectionFilter={setSelectionFilter}
            isElectionSelectionFilter={isElectionSelectionFilter}
          />
        )} */}

      </Row>

      <p>Above Table</p>
      <div className={divClass}>
        <Table hover {...getTableProps()} className={tableClass}>
          <p>Table</p>

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
                    {/* {isColumnFilter && ( // Render column filters if isColumnFilter is true
                      <Filter column={column} />
                    )} */}
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
      <Row> Row Buttom </Row>

    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;
