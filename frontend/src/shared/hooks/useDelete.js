import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useDelete = (deleteAction) => {
  const dispatch = useDispatch();

  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);

  const onClickDelete = (item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  };

  const handleDeleteItem = () => {
    if (itemToDelete) {
      dispatch(deleteAction(itemToDelete.id));
      setDeleteModal(false);
    }
  };

  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntries = document.querySelectorAll(".checkboxSelector");
    console.log("checked Entries:", checkedEntries);

    if (checkall.checked) {
      checkedEntries.forEach(entry => {
        entry.checked = true;
      });
    } else {
      checkedEntries.forEach(entry => {
        entry.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  const deleteCheckbox = () => {
    const checkedEntry = document.querySelectorAll(".checkboxSelector:checked");
    checkedEntry.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(checkedEntry);
  };

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(deleteAction(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  return {
    // Basic delete actions
    handleDeleteItem,
    onClickDelete,



    // Modals
    setDeleteModal,
    deleteModal,
    setDeleteModalMulti,
    deleteModalMulti,

    // Checkbox related
    checkedAll,
    deleteCheckbox,

    // Multi-delete actions
    deleteMultiple,
    isMultiDeleteButton,
  };
};

export { useDelete };
