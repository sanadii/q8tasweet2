
const CheckboxHeader = ({ handleCheckAllClick }) => (
    <input
        type="checkbox"
        id="checkBoxAll"
        className="form-check-input"
        onClick={handleCheckAllClick}
    />
);

const CheckboxCell = ({ row, handleCheckCellClick }) => (
    <input
        type="checkbox"
        className="checkboxSelector form-check-input"
        value={row.original.id}
        onChange={handleCheckCellClick}
    />
);

export { CheckboxHeader, CheckboxCell }