import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { GuaranteeStatusOptions } from "shared/constants";

const GuaranteeStatusFilter = ({ filters, setFilters }) => {

    const ChangeCampaignGuaranteeStatus = (e) => {
      const selectedStatusId = e ? parseInt(e, 10) : null; // Convert string to integer, if no value is provided it will become null
  
      // Update the filters
      setFilters(prev => ({
        ...prev,
        status: selectedStatusId,
      }));
    };
  
    return (
      <React.Fragment>
        <div className="col-lg-3 col-sm-2">
          <strong>الحالة</strong>
          <div className="input-light">
            <select
              className="form-select form-control"
              name="choices-select-status"
              id="choices-select-status"
              onChange={(e) => ChangeCampaignGuaranteeStatus(e.target.value)}
              value={filters.status || ''}
            >
              <option value="">- الكل - </option>
              {GuaranteeStatusOptions.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </React.Fragment>
    );
  };

  export default GuaranteeStatusFilter;
=======
import { CampaignGuaranteeStatusOptions } from "shared/constants";

const GuaranteeStatusFilter = ({ filters, setFilters }) => {

  const ChangeCampaignGuaranteeStatus = (e) => {
    const selectedStatusId = e ? parseInt(e, 10) : null; // Convert string to integer, if no value is provided it will become null

    // Update the filters
    setFilters(prev => ({
      ...prev,
      guaranteeStatus: selectedStatusId,
    }));
  };

  return (
    <React.Fragment>
      <div className="col-lg-2 col-sm-2">
        <strong>الحالة</strong>
        <div className="input-light">
          <select
            className="form-select form-control"
            name="choices-select-status"
            id="choices-select-status"
            onChange={(e) => ChangeCampaignGuaranteeStatus(e.target.value)}
            value={filters.status || ''}
          >
            <option value="">- الكل - </option>
            {CampaignGuaranteeStatusOptions.map((status) => (
              <option
                key={status.id}
                value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GuaranteeStatusFilter;
>>>>>>> sanad
