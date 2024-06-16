import { Table, Row, Col, Button, Input, CardBody, CardHeader } from "reactstrap";

<<<<<<< HEAD
=======
// Card Spinner
const spinner = (id) => {
    document.getElementById(id)?.classList.remove("d-none");
    document.getElementById(id)?.classList.add("d-block");
    setTimeout(function () {
        document.getElementById(id)?.classList.remove("d-block");
        document.getElementById(id)?.classList.add("d-none");
    }, 3000);
};


>>>>>>> sanad
const TableContainerHeader = ({
    // NEW CAMPAIGN
    HandlePrimaryButton,
    HandleSecondaryButton,
    HandleTertiaryButton,

    PrimaryButtonText,
    SecondaryButtonText,
    TertiaryButtonText,

    isElectionCandidateButtons,
    openCandidateModal,
    openCampaignModal,


    // Title
    ContainerHeaderTitle,

    // Add Button
    isAddButton,
    isContainerAddButton,
    isAddCampaign,
    isAddResults,
    AddButtonText,
    handleEntryClick,
    handleElectionCampaignClick,
    handleAddButtonClick,

    // Add Elector Button
    isAddElectorButton,

    // Delete Button
    isMultiDeleteButton,
    setDeleteModalMulti,

}) => {
    return (
<<<<<<< HEAD
        <Row className="g-4 mb-4">
            <div className="d-flex align-items-center">
                <Col>
                    <h4>
                        <b>{ContainerHeaderTitle}</b>
                    </h4>
                </Col>
                <div className="flex-shrink-0">
                    <div className="d-flex flex-wrap gap-2">
                        {HandlePrimaryButton &&
                            (
                                <Button
                                    type="button"
                                    className="btn btn-primary add-btn me-1"
                                    onClick={() => { HandlePrimaryButton(); }}
                                >
                                    <i className="mdi mdi-plus-circle-outline me-1" />
                                    {PrimaryButtonText}
                                </Button>
                            )}

                        {HandleSecondaryButton &&
                            (
                                <Button
                                    className="btn btn-danger add-btn me-1"
                                    onClick={() => HandleSecondaryButton()}
                                >
                                    <i className="mdi mdi-plus-circle-outline me-1" />
                                    {SecondaryButtonText}
                                </Button>
                            )}
                        {HandleTertiaryButton &&
                            (
                                <Button
                                    className="btn btn-success add-btn me-1"
                                    onClick={() => HandleTertiaryButton()}
                                >
                                    <i className="mdi mdi-plus-circle-outline me-1" />
                                    {TertiaryButtonText}
                                </Button>

                            )}
                        {isContainerAddButton && (
                            <Button
                                type="button"
                                className="btn btn-primary add-btn me-1"
                                onClick={() => { handleEntryClick(); }}
                            >
                                <i className="mdi mdi-plus-circle-outline me-1" />
                                {AddButtonText}
                            </Button>
                        )}
                        {isAddButton && (
                            <Button
                                className="btn btn-primary add-btn me-1"
                                onClick={() => { handleAddButtonClick("AddModal"); }}
                            >
                                <i className="ri-add-line align-bottom me-1"></i>
                                {AddButtonText}
                            </Button>
                        )}
                        {/* {(isAddCampaign &&
=======
        <CardHeader>
            <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                    <h3 className="card-title mb-0">
                        <b>{ContainerHeaderTitle}</b>
                    </h3>
                </div>
                <div className="flex-shrink-0">
                    <div className="flex-shrink-0">
                        <div className="d-flex flex-wrap gap-2">
                            {HandlePrimaryButton &&
                                (
                                    <Button
                                        type="button"
                                        className="btn btn-primary add-btn me-1"
                                        onClick={() => { HandlePrimaryButton(); }}
                                    >
                                        <i className="mdi mdi-plus-circle-outline me-1" />
                                        {PrimaryButtonText}
                                    </Button>
                                )}

                            {HandleSecondaryButton &&
                                (
                                    <Button
                                        className="btn btn-danger add-btn me-1"
                                        onClick={() => HandleSecondaryButton()}
                                    >
                                        <i className="mdi mdi-plus-circle-outline me-1" />
                                        {SecondaryButtonText}
                                    </Button>
                                )}
                            {HandleTertiaryButton &&
                                (
                                    <Button
                                        className="btn btn-success add-btn me-1"
                                        onClick={() => HandleTertiaryButton()}
                                    >
                                        <i className="mdi mdi-plus-circle-outline me-1" />
                                        {TertiaryButtonText}
                                    </Button>

                                )}
                            {isContainerAddButton && (
                                <Button
                                    type="button"
                                    className="btn btn-primary add-btn me-1"
                                    onClick={() => { handleEntryClick(); }}
                                >
                                    <i className="mdi mdi-plus-circle-outline me-1" />
                                    {AddButtonText}
                                </Button>
                            )}
                            {isAddButton && (
                                <Button
                                    className="btn btn-primary add-btn me-1"
                                    onClick={() => { handleAddButtonClick("AddModal"); }}
                                >
                                    <i className="ri-add-line align-bottom me-1"></i>
                                    {AddButtonText}
                                </Button>
                            )}
                            {/* {(isAddCampaign &&
>>>>>>> sanad
                            <Button
                                type="button"
                                className="btn btn-danger add-btn me-1"
                                onClick={() => {
                                    handleElectionCampaignClick();
                                }}
                            >
                                <i className="mdi mdi-plus-circle-outline me-1" />
                                الحملات
                            </Button>
                        )}
                        {(isAddResults &&
                            <Button
                                type="button"
                                className="btn btn-info add-btn me-1"
                                onClick={() => {
                                    handleEntryClick();
                                }}
                            >
                                <i className="mdi mdi-plus-circle-outline me-1" />
                                النتائج
                            </Button>
                        )} */}
<<<<<<< HEAD
                        {/* {isAddElectorButton && (
=======
                            {/* {isAddElectorButton && (
>>>>>>> sanad
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
<<<<<<< HEAD
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
=======
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
            </div>
        </CardHeader>
>>>>>>> sanad
    )
}

export default TableContainerHeader
