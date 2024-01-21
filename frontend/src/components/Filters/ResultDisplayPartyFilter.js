import React from "react";
import { useSelector } from "react-redux";
import { GenderOptions } from "constants";
import { campaignSelector } from 'Selectors';

const ResultDisplayOption = [
    { id: 1, name: "القوائم والمرشحين", value: "partyCandidateOriented" },
    { id: 2, name: "القوائم فقط", value: "partyOriented" },
    { id: 3, name: "المرشحين فقط", value: "candidateOriented" },
]


const GenderFilter = ({ filters, setFilters }) => {
    const campaignGuarantees = useSelector(campaignSelector);
  
    const ChangeGuaranteeGender = (e) => {
      const selectedResultDisplay = e ? Number(e) : null; // Convert to number
  
      // Update the filters
      setFilters(prev => ({
        ...prev,
        resultDisplay: selectedResultDisplay,
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
              {ResultDisplayOption.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </React.Fragment>
    );
  };

export default GenderFilter;
