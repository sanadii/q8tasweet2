import React from "react";
import { useAsyncDebounce } from "react-table";


const GlobalFilter = ({
    preGlobalFilteredRows,
    globalFilter,
    SearchPlaceholder,
    setFilters,
}) => {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = React.useState(globalFilter);
    const onChange = useAsyncDebounce((value) => {
        setFilters(prev => ({ ...prev, global: value || undefined }));
    }, 200);

    React.useEffect(() => {
        setValue(globalFilter);
    }, [globalFilter]);

    return (
        <React.Fragment>
            <div className="col-lg-3 col-sm-2">
                <form>
                    <strong>البحث</strong>
                    <div className="search-box me-2 mb-2 d-inline-block col-12">
                        <input
                            onChange={(e) => {
                                setValue(e.target.value);
                                onChange(e.target.value);
                            }}
                            id="search-bar-0"
                            type="text"
                            className="form-control search /"
                            placeholder={SearchPlaceholder}
                            value={value || ""}
                        />
                        {/* <i className="bx bx-search-alt search-icon"></i> */}
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
}

export default GlobalFilter;
