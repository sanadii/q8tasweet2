<Col xxl={9}>
<Card id="memberList">
  <CardBody className="pt-0">
    <div>
      {memberList.length ? (
        <TableContainer
          columns={columns}
          data={memberList || []}
          isGlobalFilter={true}
          isAddUserList={false}
          isCampaignMemberFilter={true}
          SearchPlaceholder="Search for campaignMember..."
          customPageSize={50}
          className="custom-header-css"
          divClass="table-responsive table-card mb-2"
          tableClass="align-middle table-nowrap"
          theadClass="table-light"
          handleCampaignMemberClick={handleCampaignMemberClicks}
        />
      ) : (
        <Loader error={error} />
      )}
    </div>
    <Modal
      isOpen={modal}
      toggle={openModal}
      centered
      className="border-0"
    >
      <ModalHeader
        toggle={openModal}
        className="p-3 ps-4 bg-soft-success"
      >
        Members
      </ModalHeader>

      {/* Wrap the content with the Form component */}
      <ModalBody className="p-4">
        <div className="search-box mb-3">
          <Input
            type="text"
            className="form-control bg-light border-light"
            placeholder="Search here..."
            value={searchMemberInput}
            onChange={(e) => setSearchMemberInput(e.target.value)}
          />
          <i className="ri-search-line search-icon"></i>
        </div>

        <SimpleBar
          className="mx-n4 px-4"
          data-simplebar="init"
          style={{ maxHeight: "225px" }}
        >
          <div className="vstack gap-3">
            {filteredMembers.map((member) => (
              <Form
                key={member.id} // Add key prop here to resolve the react/jsx-key error
                className="tablelist-form"
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent page refresh
                  const newCampaignMember = {
                    id: (
                      Math.floor(Math.random() * (100 - 20)) + 20
                    ).toString(),
                    election_id: election_id,
                    member_id: member.id, // Use the member.id directly from the map function
                  };
                  dispatch(addNewCampaignMember(newCampaignMember));
                }}
              >
                <div className="d-flex align-items-center">
                  <input type="hidden" id="id-field" />
                  <div className="avatar-xs flex-shrink-0 me-3">
                    <img
                      src={member.avatar}
                      alt=""
                      className="img-fluid rounded-circle"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="fs-13 mb-0">
                      <Link to="#" className="text-body d-block">
                        {member.name}
                      </Link>
                    </h5>
                  </div>
                  <div className="flex-shrink-0">
                    {campaignMembers.some(
                      (item) => item.member_id === member.id
                    ) ? (
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        disabled
                      >
                        ADDED
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-light btn-sm"
                        id="add-btn"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </Form>
            ))}
          </div>
        </SimpleBar>
      </ModalBody>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-light w-xs"
          data-bs-dismiss="modal"
        >
          Cancel
        </button>
      </div>
    </Modal>

    {/* <Modal
      id="showModal"
      isOpen={modal}
      toggle={toggle}
      centered
      size="lg"
    >
      <ModalHeader className="bg-soft-info p-3" toggle={toggle}>
        {!!isEdit
          ? "Edit CampaignMember"
          : "Add CampaignMember"}
      </ModalHeader>
      <Form
        className="tablelist-form"
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <ModalBody>
          <input type="hidden" id="id-field" />
          <Row className="g-3">
            <Col lg={12}></Col>
            <Col lg={6}>
              <div>
                <Label
                  htmlFor="member-id-field"
                  className="form-label"
                >
                  Member ID
                </Label>
                <Input
                  name="member_id"
                  id="member-id-field"
                  className="form-control"
                  placeholder="Enter Member ID"
                  type="text"
                  validate={{
                    required: { value: true },
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.member_id || ""}
                  invalid={
                    validation.touched.member_id &&
                      validation.errors.member_id
                      ? true
                      : false
                  }
                />
                {validation.touched.member_id &&
                  validation.errors.member_id ? (
                  <FormFeedback type="invalid">
                    {validation.errors.member_id}
                  </FormFeedback>
                ) : null}
              </div>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            <Button
              color="light"
              onClick={() => {
                setModal(false);
              }}
            >
              {" "}
              Close{" "}
            </Button>
            <Button type="submit" color="success" id="add-btn">
              {" "}
              {!!isEdit ? "Update" : "Add CampaignMember"}{" "}
            </Button>
          </div>
        </ModalFooter>
      </Form>
    </Modal> */}
    <ToastContainer closeButton={false} limit={1} />
  </CardBody>
</Card>
</Col>