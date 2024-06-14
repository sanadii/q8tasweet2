// React core imports
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCampaign } from "store/actions";
import { Link } from "react-router-dom";
import { ImageCircle } from "shared/components";
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Form } from "reactstrap";
import SimpleBar from "simplebar-react";
import debounce from 'lodash/debounce';

export const ElectionCampaignModal = ({
  modal,
  toggle,
  setModal,
  isEdit,
  electionCampaign,
}) => {
  const dispatch = useDispatch();

  const openModal = () => setModal(!modal);
  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <Modal isOpen={modal} toggle={openModal} centered className="border-0">
      <ModalHeader className="p-3 ps-4 bg-soft-success">
        الحملات الإنتخابية
      </ModalHeader>
      <ModalBody className="p-4">
        <AddElectionCampaignModal toggle={toggle} />
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <Button
            color="light"
            onClick={openModal}
          >
            خروج
          </Button>
        </div>
      </ModalFooter>
    </Modal >
  );
};

const AddElectionCampaignModal = ({ toggle }) => {
  const dispatch = useDispatch();
  const { electionCandidates, electionCampaigns } = useSelector((state) => ({
    electionCandidates: state.Elections.electionCandidates || [],
    electionCampaigns: state.Elections.electionCampaigns || [],
  }));

  const [searchInput, setSearchInput] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState(electionCandidates);

  useEffect(() => {
    setFilteredCandidates(
      electionCandidates.filter((candidate) =>
        candidate.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [electionCandidates, searchInput]);

  const handleSearchInputChange = useCallback(debounce((value) => {
    setSearchInput(value);
  }, 300), []);

  const handleSubmit = (e, electionCandidate) => {
    e.preventDefault();
    const newCampaign = {
      id: (Math.floor(Math.random() * (100 - 20)) + 20).toString(),
      election_candidate: electionCandidate.id,
    };
    dispatch(addCampaign(newCampaign));
    toggle(); // Close the modal after submission
  };

  return (
    <>
      <div className="search-box mb-3">
        <Input
          type="text"
          className="form-control bg-light border-light"
          placeholder="Search here..."
          onChange={(e) => handleSearchInputChange(e.target.value)}
        />
        <i className="ri-search-line search-icon"></i>
      </div>

      <SimpleBar className="mx-n4 px-4" data-simplebar="init" style={{ maxHeight: "225px" }}>
        <div className="vstack gap-3">
          {filteredCandidates.map((candidate) => (
            <ElectionCandidateForm
              key={candidate.id}
              candidate={candidate}
              onSubmit={handleSubmit}
            />
          ))}
        </div>
      </SimpleBar>
    </>
  );
};


const ElectionCandidateForm = ({ candidate, onSubmit }) => (
  <Form className="tablelist-form" onSubmit={(e) => onSubmit(e, candidate)}>
    <div className="d-flex align-items-center">
      <input type="hidden" id="id-field" name="id" value={candidate.id} />
      <ImageCircle imagePath={candidate.image} />
      <div className="flex-grow-1">
        <h5 className="fs-13 mb-0">
          <Link to="#" className="text-body d-block">
            {candidate.name} - {candidate.id}
          </Link>
        </h5>
      </div>
      <div className="flex-shrink-0">
        {candidate.campaign !== null ? (
          <p className="success mb-0 text-success">تمت إضافة حملة</p>
        ) : (
          <button type="submit" className="btn btn-light btn-sm" id="add-btn">
            أضف حملة إنتخابية
          </button>
        )}
      </div>
    </div>
  </Form>
);

export default ElectionCampaignModal;
