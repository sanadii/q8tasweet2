import { TableContainer } from "shared/components";

const Candidates = ({ columns, transformedCandidateData }) => {
    return (
  
      <>
        <p>هذه الجدول يحتوي على المرشحين فقط</p>
        <TableContainer
  
          // Data
          columns={columns}
          data={transformedCandidateData}
          customPageSize={50}
          isTableFooter={false}
          sortBy="name"
          sortAsc={true}
  
          // Styling
          divClass="table-responsive table-card mb-3"
          tableClass="align-middle table-bordered border-secondary table-striped-columns table-nowrap mb-0"
          theadClass="table-light table-nowrap"
          thClass="table-light text-muted"
        />
      </>
    )
  };

  export default Candidates;