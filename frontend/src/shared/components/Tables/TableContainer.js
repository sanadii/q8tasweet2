import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { useTable, useGlobalFilter, useSortBy, useFilters, useExpanded, usePagination, useRowSelect } from "react-table";
import { Table, Row, Col, Button, Input, CardBody, CardFooter } from "reactstrap";
import { DefaultColumnFilter } from "../Filters";
import { TableContainerFooter } from "shared/components";


const defaultSortMethod = (rowA, rowB, columnId, desc) => {
  const valA = rowA.values[columnId];
  const valB = rowB.values[columnId];

  // Consider rows without a position as the smallest values
  if (valA === null && valB === null) return 0;
  if (valA === null) return 1;
  if (valB === null) return -1;

  // Fallback to the default behavior
  if (typeof valA === 'number' && typeof valB === 'number') {
    return valA > valB ? 1 : valA < valB ? -1 : 0;
  }

  // Fallback to string comparison
  return String(valA).localeCompare(String(valB));
};


const TableContainer = ({
  // Settings
  customPageSize,
  ExpandedComponent,
  // Actions
  onTabChange,
  getBgClassForStatus,

  // Data & Columns----------
  columns,
  data,

  // Table Sorting ----------
  sortBy,
  sortAsc,
  sortDesc,

  // Table Styling----------
  tableClass,
  theadClass,
  trClass,
  thClass,
  tdClass,
  divClass,

  // Global Header----------
  isTablePagination,
  isTableFooter,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
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

    // Table Options
    isSorting,
    visibleColumns,

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
            id: sortBy,
            asc: sortAsc,
            desc: sortDesc,
          },
        ],

      },
      sortTypes: {
        alphanumeric: defaultSortMethod,
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
    return column.isSorted ? (column.isSortedDesc ? " ↓" : " ↑") : " ↓↑";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };
  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(windowWidth <= 768); // Assuming 768px as the breakpoint
  const [showFilters, setShowFilters] = useState(!isMobile); // Filters should be displayed by default for non-mobile
  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth <= 768;
      setWindowWidth(window.innerWidth);
      setIsMobile(isCurrentlyMobile);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderTableHeader = (column, isSorting) => (
    <th key={column.id} className={thClass} {...(isSorting ? column.getSortByToggleProps() : {})}>
      {column.render("Header")}
      {isSorting && generateSortingIndicator(column)}
      {/* <Filter column={column} /> */}
    </th>
  );



  return (
    <Fragment>
      <CardBody>

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
                      {...(isSorting ? column.getSortByToggleProps() : {})}
                    >

                      {column.render("Header")}
                      {isSorting && generateSortingIndicator(column)}
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
                      {row.cells.map((cell, columnIndex) => {
                        let className = '';

                        // Check if getBgClassForStatus exists and columnIndex is not 0, then call it
                        if (getBgClassForStatus && columnIndex !== 0) {
                          className = getBgClassForStatus(columnIndex);
                        }

                        return (
                          <td
                            key={cell.id}
                            {...cell.getCellProps()}
                            className={className} // Assign the calculated className here
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Expanded */}
                    {/* Below the row, check if it's expanded and render additional content */}
                    {row.isExpanded &&
                      <tr>
                        <td colSpan={columns.length}>
                          <ExpandedComponent row={row} />
                        </td>
                      </tr>
                    }

                  </Fragment>
                );
              })}
            </tbody>

            {/* Table Footer */}
            {isTableFooter &&
              <tfoot>
                {footerGroups.map((footerGroup) => (
                  <tr
                    {...footerGroup.getFooterGroupProps()}
                    key={footerGroup.id} // Add this line
                  >
                    {footerGroup.headers.map((column) => (
                      <td
                        {...column.getFooterProps()}
                        key={column.id} // Add this line
                      >
                        {column.render('Footer')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tfoot>
            }
          </Table>
        </div>

        {isTablePagination !== false &&

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
        }
      </CardBody>
      {
        isTableFooter &&
        <CardFooter>
          <TableContainerFooter />
        </CardFooter>
      }
    </Fragment >
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;

