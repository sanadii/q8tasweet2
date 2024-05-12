const getSelectionOptions = (itemList) => {
    return itemList.map(item => ({
        id: item.id,
        label: item.name,
        value: item.id
    }));
}

export { getSelectionOptions }