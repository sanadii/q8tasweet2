
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';
import { ButtonGroup, Button, Label, Input } from "reactstrap";
import Select from "react-select";


import { getElectorsByCategory } from "store/actions";


const SidebarFields = ({
    viewState,
    setViewState,

}) => {
    const dispatch = useDispatch();
    const { electionSlug, electionDetails } = useSelector(electionSelector);
    const isElectorAddress = electionDetails?.isElectorAddress
    const isElectorCommittee = electionDetails?.isElectorCommittee

    const {
        branchOptions, areaOptions, committeeOptions,
        electorsByAll, electorsByFamily, electorsByArea
    } = useSelector(electorSelector);

    const { familyOptions } = electorsByAll
    const { selectionFilters, viewSettings } = viewState

    const handleFamilyBranchChange = useCallback((type, value) => {
        // Create a new state object based on the previous state
        const newState = {
            ...viewState,
            selectionFilters: { ...viewState.selectionFilters, [type]: value },
            viewSettings: {
                ...viewState.viewSettings,
                displayAllElectors: false,  // Correctly set displayAllElectors to false
            }

        };

        const { selectedFamilies, selectedBranches, selectedAreas } = newState.selectionFilters;

        // Assuming you want to dispatch an action if there is a valid family or family division selected
        if (selectedFamilies.length > 0 || (selectedBranches.length > 0) || (selectedAreas.length > 0)) {
            dispatch(getElectorsByCategory({
                schema: electionSlug,
                families: newState.selectionFilters.selectedFamilies.map(option => option.value),
                branches: newState.selectionFilters.selectedBranches.map(option => option.value),
                areas: newState.selectionFilters.selectedAreas.map(option => option.value),
                committees: newState.selectionFilters.selectedCommittees.map(option => option.value),
            }));
        }

        setViewState(newState);

    }, [dispatch, viewState, setViewState, electionSlug]);



    return (
        <React.Fragment>
            <div className="family-view-options z-index-2">
                <div>
                    <div className="pb-3">
                        <Label for="familySelect">إختر القبيلة \ القبائل</Label>
                        <Select
                            value={selectionFilters.selectedFamilies}
                            isMulti={true}
                            onChange={(value) => handleFamilyBranchChange('selectedFamilies', value)}
                            options={familyOptions}
                            classNamePrefix="select"
                        />
                    </div>
                    <div className="pb-3">
                        <Label for="familySelect">إختر الفخذ \ الأفخاذ</Label>
                        <Select
                            id="familySelect"
                            value={selectionFilters.familyBranches}
                            onChange={(value) => handleFamilyBranchChange('selectedBranches', value)}
                            isMulti
                            options={branchOptions}
                            classNamePrefix="select"
                        />
                    </div>
                    {areaOptions && isElectorAddress &&
                        <div className="pb-3">
                            <Label for="areaSelect">المناطق</Label>
                            <Select
                                id="areaSelect"
                                value={selectionFilters.familyDivisionsAreas}
                                isMulti
                                onChange={(value) => handleFamilyBranchChange('selectedAreas', value)}
                                options={areaOptions}
                                classNamePrefix="select"
                            />
                        </div>
                    }

                    {committeeOptions && isElectorCommittee &&
                        <div className="pb-3">
                            <Label for="areaSelect">اللجان</Label>
                            <Select
                                id="areaSelect"
                                value={selectionFilters.familyDivisionsAreas}
                                isMulti
                                onChange={(value) => handleFamilyBranchChange('selectedCommittees', value)}
                                options={committeeOptions}
                                classNamePrefix="select"
                            />
                        </div>
                    }
                </div>
            </div>

        </React.Fragment >
    )
}

export default SidebarFields;