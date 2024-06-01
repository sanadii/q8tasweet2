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

  // 
  // on Check Single Cell (Cell)
  // 
  const handleCheckCellClick = useCallback(() => {
    const checkedEntries = document.querySelectorAll(".checkboxSelector:checked");
    setSelectedCheckBoxDelete(Array.from(checkedEntries));
    setIsMultiDeleteButton(checkedEntries.length > 0);
  }, []);

  // 
  // on Check All (Header)
  // 
  const handleCheckAllClick = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const checkedEntries = document.querySelectorAll(".checkboxSelector");
    console.log("Check All Checkbox:", checkall);
    console.log("Individual Checkboxes:", checkedEntries);

    if (checkall.checked) {
      checkedEntries.forEach(entry => {
        entry.checked = true;
      });
    } else {
      checkedEntries.forEach(entry => {
        entry.checked = false;
      });
    }
    handleCheckCellClick();
  }, [handleCheckCellClick,]);



  const handleItemDeleteClick = useCallback((item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  }, []);



  // 
  // on Delete multiple action
  // 
  const handleDeleteMultiple = (schema) => {
    selectedCheckBoxDelete.forEach((element) => {
      console.log("selectedCheckBoxDelete: ", selectedCheckBoxDelete)
      const itemToDelete = {
        id: element.value,
        schema: schema || null
      }
      dispatch(deleteAction(itemToDelete));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete([]);
  };


  // 
  // on Delete single Item action
  // 
  const handleDeleteItem = () => {
    if (itemToDelete) {
      dispatch(deleteAction(itemToDelete));
      setDeleteModal(false);
    }
  };

  // 
  // on Delete single Item action
  // 
  const handleSchemaDeleteItem = () => {
    console.log("itemToDelete: ", itemToDelete)
    if (itemToDelete) {
      dispatch(deleteAction(itemToDelete));
      setDeleteModal(false);
    }
  };

  return {
    // Basic delete actions
    handleDeleteItem,
    handleSchemaDeleteItem,
    handleItemDeleteClick,
    // Modals
    setDeleteModal,
    deleteModal,
    setDeleteModalMulti,
    deleteModalMulti,

    // Checkbox related
    handleCheckAllClick,
    handleCheckCellClick,
    selectedCheckBoxDelete,

    // Multi-delete actions
    handleDeleteMultiple,
    isMultiDeleteButton,
  };
};

export { useDelete };
