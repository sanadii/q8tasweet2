
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';
import { ButtonGroup, Button, Label, Input } from "reactstrap";
import Select from "react-select";


import { getElectorsByCategory, getElectorFamilyDivisions } from "store/actions";


const ChartSideBarFamilyView = ({
    viewState,
    setViewState,
    selectionFilters,
    viewDetails
}) => {
    const dispatch = useDispatch();
    const { electionSlug } = useSelector(electionSelector);

    const { electorsByFamily, electorsByArea, familyBranches } = useSelector(electorSelector);

    const familyOptions = useMemo(() => (
        electorsByFamily.categories.map(category => ({ label: category, value: category })) || []
    ), [electorsByFamily]);


    const familyBranchOptions = useMemo(() => (
        familyBranches.map(category => ({ label: category, value: category })) || []
    ), [familyBranches]);

    const areaOptions = useMemo(() => (
        electorsByArea.categories?.map(category => ({ label: category, value: category }))
    ), [electorsByArea]);




    const handleFamilyChartView = useCallback((selectedChartView) => {
        setViewState(prev => ({
            ...prev,
            viewDetails: { ...prev.viewDetails, activeFamilyView: selectedChartView }
        }));
    }, [setViewState]);

    const handleFamilyAreaChange = useCallback((type, value) => {
        // Calculate the updated state based on the current state
        const newState = {
            ...viewState,
            selectionFilters: { ...viewState.selectionFilters, [type]: value },
            viewDetails: { ...viewState.viewDetails, activeFamilyView: "detailedFamilyAreaView" }
        };

        // Dispatch an action or perform a calculation
        const { selectedFamilies, selectedAreas } = newState.selectionFilters;
        if (selectedFamilies.length > 0 || selectedAreas.length > 0) {
            console.log('Dispatching actions based on updated selections:', selectedFamilies, selectedAreas);
            dispatch(getElectorsByCategory({
                slug: electionSlug,
                families: selectedFamilies.map(option => option.value),
                areas: selectedAreas.map(option => option.value)
            }));
        }

        // Update the component state
        setViewState(newState);
    }, [dispatch, viewState, setViewState, electionSlug]);

    const handleFamilyBranchChange = useCallback((type, value) => {
        // Create a new state object based on the previous state
        const newState = {
            ...viewState,
            selectionFilters: { ...viewState.selectionFilters, [type]: value },
            viewDetails: { ...viewState.viewDetails, activeFamilyView: "detailedFamilyDivisionView" }
        };

        const { selectedFamily, selectedFamilyBranches } = newState.selectionFilters;

        // Assuming you want to dispatch an action if there is a valid family or family division selected
        if (selectedFamily || (selectedFamilyBranches.length > 0)) {
            console.log('newState safe for dispatch');

            dispatch(getElectorFamilyDivisions({
                schema: electionSlug,
                family: newState.selectionFilters.selectedFamily?.value,
                familyBranches: newState.selectionFilters.selectedFamilyBranches.map(option => option.value)
            }));
        }

        setViewState(newState);

    }, [dispatch, viewState, setViewState, electionSlug]);



    return (
        <React.Fragment>
            <h5><b>الناخبين حسب القبائل \ العوائل</b></h5>
            <ButtonGroup className="mt-2 material-shadow w-100">
                <Button
                    color="soft-danger"
                    className={`material-shadow-none ${viewState.viewDetails.activeFamilyView === "detailedFamilyAreaView" ? 'active' : ''}`}
                    onClick={() => handleFamilyChartView("detailedFamilyAreaView")}>
                    قبائل
                </Button>
                <Button
                    color="soft-danger"
                    className={`material-shadow-none ${viewState.viewDetails.activeFamilyView === 'detailedFamilyDivisionView' ? 'active' : ''}`}
                    onClick={() => handleFamilyChartView("detailedFamilyDivisionView")}>
                    أفخاذ
                </Button>
            </ButtonGroup>

            {viewDetails.activeFamilyView === "detailedFamilyDivisionView" ?
                <>
                    <div>
                        <Label for="familySelect">إختر القبيلة</Label>
                        <Select
                            id="familySelect"
                            value={selectionFilters.family}
                            onChange={(value) => handleFamilyBranchChange('selectedFamily', value)}
                            options={familyOptions}
                            classNamePrefix="select"
                        />
                    </div>

                    <div>
                        <Label for="familySelect">إختر الأفخاذ</Label>
                        <Select
                            id="familySelect"
                            value={selectionFilters.familyBranches}
                            onChange={(value) => handleFamilyBranchChange('selectedFamilyBranches', value)}
                            isMulti
                            options={familyBranchOptions}
                            classNamePrefix="select"
                        />
                    </div>
                    <Label for="areaSelect">المناطق</Label>
                    <Select
                        id="areaSelect"
                        value={selectionFilters.familyDivisionsAreas}
                        isMulti
                        onChange={(value) => handleFamilyBranchChange('selectedFamilyBranchesAreas', value)}
                        options={areaOptions}
                        classNamePrefix="select"
                    />
                </>
                :
                <>
                    <Label for="familySelect">إختر القبائل</Label>
                    <Select
                        id="familySelect"
                        value={selectionFilters.selectedFamilies}
                        isMulti={viewState.viewDetails.activeFamilyView === 'detailedFamilyAreaView'}
                        onChange={(value) => handleFamilyAreaChange('selectedFamilies', value)}
                        options={familyOptions}
                        classNamePrefix="select"
                    />
                    <Label for="areaSelect">المناطق</Label>
                    <Select
                        id="areaSelect"
                        value={selectionFilters.selectedAreas}
                        isMulti
                        onChange={(value) => handleFamilyAreaChange('selectedAreas', value)}
                        options={areaOptions}
                        classNamePrefix="select"
                    />
                </>


            }

        </React.Fragment >
    )
}

export default ChartSideBarFamilyView;