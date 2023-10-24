import { Table, Row, Col, Button, Input, CardBody, CardHeader } from "reactstrap";

const TableContainerHeader = ({
    // Title
    ContainerHeaderTitle,

    // Add Button
    isAddButton,
    isContainerAddButton,
    AddButtonText,
    handleEntryClick,
    handleAddButtonClick,

    // Add Elector Button
    isAddElectorButton,

    // Delete Button
    isMultiDeleteButton,
    setDeleteModalMulti,

}) => {
    return (
        <Row className="g-4 mb-4">
            <div className="d-flex align-items-center">
                <Col>
                    <h4>
                        <b>{ContainerHeaderTitle}</b>
                    </h4>
                </Col>
                <div className="flex-shrink-0">
                    <div className="d-flex flex-wrap gap-2">
                        {isContainerAddButton && (
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
                        )}
                        {isAddButton && (
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
                        {/* {isAddElectorButton && (
                            <Button
                                className="btn btn-primary add-btn me-1"
                                onClick={() => {
                                    // I want to go to 
                                }}
                            >
                                <i className="ri-add-line align-bottom me-1"></i>
                                {AddButtonText}
                            </Button>
                        )} */}
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
    )
}

export default TableContainerHeader
