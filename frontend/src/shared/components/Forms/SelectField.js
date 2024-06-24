
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";

const SelectField = ({ field, validation, onChangeHandler }) => {
    const { type, id, label, name, options, value, OptionCategories, onChange, onSelect } = field;

    const handleSelectChange = (selectedOption) => {
        if (type === 'selectSingle') {
            validation.setFieldValue(name, selectedOption ? selectedOption.value : null);
        } else {
            validation.setFieldValue(name, selectedOption ? selectedOption.map(option => option.value) : []);
        }
    };

    const isMultiSelect = type === 'selectMulti';

    const findLabel = (options, value) => {
        for (const option of options) {
            if (option.options) {
                const foundOption = option.options.find(opt => opt.value === value);
                if (foundOption) {
                    return foundOption.label;
                }
            } else if (option.value === value) {
                return option.label;
            }
        }
        return '';
    };

    const selectedValues = validation.values[name]
        ? isMultiSelect
            ? validation.values[name].map(value => ({
                value,
                label: findLabel(field.options, value),
            }))
            : {
                value: validation.values[name],
                label: findLabel(field.options, validation.values[name]),
            }
        : isMultiSelect
            ? []
            : null;

    return (
        <Select
            id={id}
            placeholder={`اكتب ${label}`}
            onBlur={validation.handleBlur}
            isInvalid={validation.touched[name] && validation.errors[name]}
            value={selectedValues}
            isMulti={isMultiSelect}
            onChange={handleSelectChange}
            options={field.options}
        />
    );
}

export default SelectField