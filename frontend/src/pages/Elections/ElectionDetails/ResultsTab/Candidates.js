import { TableContainer } from "components";

const Candidates = ({ columns, transformedCandidateData }) => {
    return (
  
      <>
        <p>هذه الجدول يحتوي على المرشحين فقط</p>
        <TableContainer
  
          // Data
          columns={columns}
          data={transformedCandidateData}
          customPageSize={50}
          isTableFooter={true}
          sortBy="name"
          sortAsc={true}
  
          // Styling
          divClass="table-responsive table-card mb-3"
          tableClass="align-middle table-nowrap mb-0"
          theadClass="table-light table-nowrap"
          thClass="table-light text-muted"
        />
      </>
    )
  };

  export default Candidates;