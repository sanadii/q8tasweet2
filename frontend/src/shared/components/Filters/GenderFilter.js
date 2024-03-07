import React from "react";
import { useSelector } from "react-redux";
import { GenderOptions } from "shared/constants";
import { campaignSelector } from 'Selectors';


const GenderFilter = ({ filters, setFilters }) => {
    const campaignGuarantees = useSelector(campaignSelector);
  
    const ChangeGuaranteeGender = (e) => {
      const selectedGender = e ? Number(e) : null; // Convert to number
  
      // Update the filters
      setFilters(prev => ({
        ...prev,
        gender: selectedGender,
      }));
    };
  
    return (
      <React.Fragment>
        <div className="col-lg-3 col-sm-2">
          <strong>النوع</strong>
          <div className="input-light">
            <select
              className="form-select form-control"
              name="choices-select-gender"
              id="choices-select-gender"
              onChange={(e) => ChangeGuaranteeGender(e.target.value)}
              value={filters.gender || ''}
            >
              <option value="">- الكل - </option>
              {GenderOptions.map((gender) => (
                <option key={gender.id} value={gender.id}>
                  {gender.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </React.Fragment>
    );
  };

export default GenderFilter;
