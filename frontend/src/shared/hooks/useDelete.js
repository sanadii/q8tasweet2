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

<<<<<<< HEAD
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
=======
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
>>>>>>> sanad

    if (checkall.checked) {
      checkedEntries.forEach(entry => {
        entry.checked = true;
      });
    } else {
      checkedEntries.forEach(entry => {
        entry.checked = false;
      });
    }
<<<<<<< HEAD
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
=======
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
>>>>>>> sanad
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
<<<<<<< HEAD
    checkall.checked = false;
=======
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
>>>>>>> sanad
  };

  return {
    // Basic delete actions
    handleDeleteItem,
<<<<<<< HEAD
    onClickDelete,



=======
    handleSchemaDeleteItem,
    handleItemDeleteClick,
>>>>>>> sanad
    // Modals
    setDeleteModal,
    deleteModal,
    setDeleteModalMulti,
    deleteModalMulti,

    // Checkbox related
<<<<<<< HEAD
    checkedAll,
    deleteCheckbox,

    // Multi-delete actions
    deleteMultiple,
=======
    handleCheckAllClick,
    handleCheckCellClick,
    selectedCheckBoxDelete,

    // Multi-delete actions
    handleDeleteMultiple,
>>>>>>> sanad
    isMultiDeleteButton,
  };
};

export { useDelete };
