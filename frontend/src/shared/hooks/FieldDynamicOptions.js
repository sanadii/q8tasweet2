const getFieldDynamicOptions = (items, label = null) => {
    let defaultOption = null;
    if (label) {
        defaultOption = {
            id: "default",
            label: `-- ${label} --` || "-- اختر --",
            value: null
        };
    }

    // Return options with no default option if items is not an array or is empty
    if (!Array.isArray(items) || items.length === 0) {
        return defaultOption ? [
            defaultOption,
            {
                id: "no-options",
                label: "-- لا توجد خيارات --",
                value: null
            }
        ] : [
            {
                id: "no-options",
                label: "-- لا توجد خيارات --",
                value: null
            }
        ];
    }

    // Filter and map the items to options
    const filteredItems = items.filter(item => item && item.id);
    const options = filteredItems.map(item => ({
        id: item.id,
        label: item.name,
        value: item.id,
    }));

    return defaultOption ? [defaultOption, ...options] : options;
};

export { getFieldDynamicOptions };
