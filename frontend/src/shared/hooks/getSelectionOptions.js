const getSelectionOptions = (itemList) => {
    const items = itemList || [];
    const options = items.map(item => ({
        id: item.id,
        label: item.name,
        value: item.id
    }));
    
    // Check if itemList is empty
    if (items.length === 0) {
        options.unshift({ label: "No options", value: "" });
    } else {
        options.unshift({ label: "Choose an option", value: "" });
    }

    return options;
}

export { getSelectionOptions }
