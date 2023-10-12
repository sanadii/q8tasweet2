// useDelete.js
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { deleteElection } from 'store/actions';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useDelete = () => {
  const dispatch = useDispatch();

  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [election, setElection] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);


  // Functions
  // Delete Data ------------
  const onClickDelete = (election) => {
    setElection(election);
    setDeleteModal(true);
  };

  // Delete Data ------------
  const handleDeleteElection = () => {
    if (election) {
      dispatch(deleteElection(election.id));
      setDeleteModal(false);
    }
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntry = document.querySelectorAll(".electionCheckBox");

    if (checkall.checked) {
      checkedEntry.forEach((checkedEntry) => {
        checkedEntry.checked = true;
      });
    } else {
      checkedEntry.forEach((checkedEntry) => {
        checkedEntry.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(deleteElection(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(".electionCheckBox:checked");
    checkedEntry.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(checkedEntry);

    const deleteMultiple = () => {
      const checkall = document.getElementById("checkBoxAll");
      selectedCheckBoxDelete.forEach((element) => {
        dispatch(deleteElection(element.value));
        setTimeout(() => {
          toast.clearWaitingQueue();
        }, 3000);
      });
      setIsMultiDeleteButton(false);
      checkall.checked = false;
    };

    const deleteCheckbox = () => {
      const checkedEntry = document.querySelectorAll(".electionCheckBox:checked");
      checkedEntry.length > 0
        ? setIsMultiDeleteButton(true)
        : setIsMultiDeleteButton(false);
      setSelectedCheckBoxDelete(checkedEntry);
    };

  }
  return {
    deleteMultiple,
    setDeleteModalMulti,
    deleteModalMulti,
    checkedAll,
    deleteCheckbox,
    selectedCheckBoxDelete,
    deleteModal,
    setDeleteModal,
    isMultiDeleteButton,
    onClickDelete,
    handleDeleteElection
  };
};

export default useDelete;
