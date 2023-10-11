// useDelete.js
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { deleteElection } from 'store/actions';

const useDelete = () => {
  const dispatch = useDispatch();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const onClickDelete = (item) => {
    setSelectedItems([item]);
    setDeleteModal(true);
  };

  const handleDelete = useCallback(() => {
    selectedItems.forEach((item) => {
      dispatch(deleteElection(item.id));
    });
    setDeleteModal(false);
    setSelectedItems([]);
  }, [dispatch, selectedItems]);

  const handleMultiDelete = useCallback(() => {
    selectedItems.forEach((item) => {
      dispatch(deleteElection(item.id));
    });
    setDeleteModal(false);
    setSelectedItems([]);
    setIsMultiDeleteButton(false);
  }, [dispatch, selectedItems]);

  const selectItemsForDelete = (items) => {
    setSelectedItems(items);
    setIsMultiDeleteButton(!!items.length);
    if (items.length) {
      setDeleteModal(true);
    }
  };

  return {
    deleteModal,
    setDeleteModal,
    isMultiDeleteButton,
    setIsMultiDeleteButton,
    onClickDelete,
    handleDelete,
    handleMultiDelete,
    selectItemsForDelete
  };
};

export default useDelete;
