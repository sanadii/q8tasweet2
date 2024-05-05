import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ButtonGroup, Button, Label, Input, Row, Col } from "reactstrap";
import Select from "react-select";


import { getElectorsByCategory, getElectorsByFamilyDivision } from "store/actions";
import ChartSideBarFamilyView from "./ChartSideBarFamilyView"

const ChartSideBar = ({
    handleFamilyAreaChange,
    setViewState,
    viewState
}) => {
    const { selectionFilters, viewSettings, viewDetails } = viewState;
    const { resultsToShow, displayByGender, displayByOption, displayAllOption, displayWithOption,
        displayAllElectors, familyBranchOption, areaCommitteeOption, swapView } = viewSettings

    console.log("familyBranchOption: ", familyBranchOption)
    console.log("areaCommitteeOption: ", areaCommitteeOption)

    const handleDisplayAllToggle = useCallback((option) => () => {
        setViewState(prevState => ({
            ...prevState,
            viewSettings: {
                ...prevState.viewSettings,
                displayAllElectors: option  // Dynamically set displayAllElectors based on the option
            }
        }));
    }, [setViewState]); // Only setViewState is needed in the dependency array


    const handleDisplayByOptionSelection = useCallback((optionType, option) => () => {
        setViewState(prevState => ({
            ...prevState,
            viewSettings: {
                ...prevState.viewSettings,
                [optionType]: option,
                displayAllElectors: false,
            }
        }));
    }, [setViewState]);


    const handleDisplayChartToggle = useCallback((option) => () => {
        setViewState(prevState => ({
            ...prevState,
            viewSettings: {
                ...prevState.viewSettings,
                displayChartType: option
            }
        }));
    }, [setViewState]);


    console.log("displayAllElectors: ", displayAllElectors)

    // Constants for button configurations
    const displayBySelectionButtons = useMemo(() => [
        {
            text: "الكل",
            icon: displayAllElectors ? "mdi mdi-check-all" : "mdi mdi-dots-horizontal",
            isActive: displayAllElectors, // Ensure this correctly checks the boolean state
            onClick: handleDisplayAllToggle(true),
        },
        {
            text: "تحديد",
            icon: displayAllElectors ? "mdi mdi-dots-horizontal" : "mdi mdi-check-all",
            isActive: !displayAllElectors,
            onClick: handleDisplayAllToggle(false),
        },

        // {
        //     text: "ذكور \\ إناث",
        //     icon: displayByGender ? "mdi mdi-check-all" : "mdi mdi-dots-horizontal",
        //     isActive: displayByGender === true,
        //     onClick: handleDisplayByGenderSelection(true),
        // },
    ], [displayAllElectors, handleDisplayAllToggle]);

    const displayBySelectedOptions = useMemo(() => [
        {
            groupType: "familyBranchOption",
            color: 'primary',
            items: [
                {
                    text: "",
                    icon: familyBranchOption === "" ? "mdi mdi-mdi mdi-eye-off" : "mdi mdi-eye",
                    isActive: familyBranchOption === "",
                    onClick: handleDisplayByOptionSelection("familyBranchOption", "")
                },
                {
                    text: "القبائل",
                    icon: familyBranchOption === "family" ? "mdi mdi-checkbox-marked-circle-outline" : "mdi mdi-checkbox-blank-circle-outline",
                    isActive: familyBranchOption === "family",
                    onClick: handleDisplayByOptionSelection("familyBranchOption", "family")
                },
                {
                    text: "العوائل",
                    icon: familyBranchOption === "branch" ? "mdi mdi-checkbox-marked-circle-outline" : "mdi mdi-checkbox-blank-circle-outline",
                    isActive: familyBranchOption === "branch",
                    onClick: handleDisplayByOptionSelection("familyBranchOption", "branch")
                }
            ],
        },
        {
            title: "Area Committee",
            color: 'success',
            items: [
                {
                    text: "",
                    icon: areaCommitteeOption === "" ? "mdi mdi-mdi mdi-eye-off" : "mdi mdi-eye",
                    isActive: areaCommitteeOption === "",
                    onClick: handleDisplayByOptionSelection("areaCommitteeOption", "")
                },
                {
                    text: "المناطق",
                    icon: areaCommitteeOption === "area" ? "mdi mdi-checkbox-marked-circle-outline" : "mdi mdi-checkbox-blank-circle-outline",
                    isActive: areaCommitteeOption === "area",
                    onClick: handleDisplayByOptionSelection("areaCommitteeOption", "area")
                },
                {
                    text: "اللجان",
                    icon: areaCommitteeOption === "committee" ? "mdi mdi-checkbox-marked-circle-outline" : "mdi mdi-checkbox-blank-circle-outline",
                    isActive: areaCommitteeOption === "committee",
                    onClick: handleDisplayByOptionSelection("areaCommitteeOption", "committee")
                },
            ]
        }
    ], [areaCommitteeOption, familyBranchOption, handleDisplayByOptionSelection]);


    // const displayByAreaCommitteeButtons = useMemo(() => {
    //     const options = ["areas", "committees", "family", "branches"];
    //     const optionLabels = {
    //         areas: "",
    //         committees: "اللجان",
    //         family: "القبائل",
    //         branches: "العوائل",
    //     };

    //     return options.map(option => ({
    //         text: optionLabels[option],
    //         icon: getDisplayBySelectionIcon(option),
    //         isActive: displayByOption ? displayWithOption.includes(option) : displayAllOption === option,
    //         onClick: handleDisplayOptionToggle(option),
    //     }));
    // }, [displayByOption, displayWithOption, displayAllOption, getDisplayBySelectionIcon, handleDisplayOptionToggle]);

    const displayChartButtons = useMemo(() => [

        {
            icon: "mdi mdi-chart-bar",
            color: "soft-danger",
            onClick: handleDisplayChartToggle("bar"),
        },
        {
            icon: "mdi mdi-chart-pie",
            color: "soft-primary",
            onClick: handleDisplayChartToggle("pie"),
        },
        {
            icon: "mdi mdi-chart-line",
            color: "soft-success",
            onClick: handleDisplayChartToggle("line")
        },
        {
            icon: "mdi mdi-apps",
            color: "soft-success",
            onClick: handleDisplayChartToggle("heatMap")
        },
        {
            icon: "mdi mdi-chart-bubble",
            color: "soft-secondary",
            onClick: handleDisplayChartToggle("bubble")
        },

    ], [handleDisplayChartToggle]);

    const renderButtonGroup = (buttonConfigs, color) => (
        <ButtonGroup className="w-100 pb-1">
            {buttonConfigs.map((btn, index) => (
                <Button
                    key={index}
                    className={`${btn.text ? "btn-label" : "btn-icon"} btn-sm material-shadow-none ${btn.isActive ? `bg-${color} ` : `bg-light text-${color}`}`}
                    onClick={btn.onClick}
                    active={btn.isActive}
                >

                    {btn.text ?
                        <>
                            <i className={`${btn.icon} label-icon align-middle fs-16 me-2`}></i>
                            {btn.text}
                        </>
                        :
                        <i className={`${btn.icon} label-icon align-middle fs-16 me-2`}></i>

                    }
                </Button>
            ))}
        </ButtonGroup>
    );
    const renderChartButtonGroup = (buttonConfigs, isIconOnly = false) => (
        <ButtonGroup className="w-100 pb-1">
            {buttonConfigs.map((btn, index) => (
                <Button
                    key={index}
                    color={btn.color}
                    className={`btn-icon material-shadow-none"}`}
                    onClick={btn.onClick}
                    active={btn.isActive}
                >
                    <i className={`${btn.icon} label-icon align-middle fs-16 me-2`}></i>
                    {btn.text}
                </Button>

            ))}
        </ButtonGroup>

    );
    return (
        <div className="chat-leftsidebar bg-light">
            <div className="px-2 pt-2 mb-2">
                {viewSettings.activeView === "electorsByFamily" &&
                    <ChartSideBarFamilyView
                        viewState={viewState}
                        setViewState={setViewState}
                        handleFamilyAreaChange={handleFamilyAreaChange}
                    />
                }
                <div className="view-settings">
                    <p>All / With Selection</p>
                    <p>Family & Branches</p>
                    <p>areas & Committees</p>

                    <p>gender / no gender</p>
                    {/* Add success color */}
                    {renderButtonGroup(displayBySelectionButtons, 'danger')}

                    {/* Add primary color */}
                    {/* {renderButtonGroup(displayByFieldButtons, 'primary')} */}
                    {/* <div className="d-flex"> */}
                    {/* <Row className="d-flex"> */}

                    {displayBySelectedOptions.map((optionGroup, index) => (
                        <div key={index}>
                            {/* <h3>{optionGroup.title}</h3> */}
                            {renderButtonGroup(optionGroup.items, optionGroup.color)}
                        </div>
                    ))}

                    {/* {renderButtonGroup(displayByAreaCommitteeButtons, 'primary')} */}

                    {renderChartButtonGroup(displayChartButtons)}



                </div>
                {viewSettings.activeView === "detailedFamilyChart" &&
                    <Button
                        color="primary"
                        className="btn-icon material-shadow-none"
                        title="إعادة تعيين القبائل"
                        outline
                        onClick={() => setViewState(prev => ({ ...prev, viewSettings: { ...prev.viewSettings, activeView: "detailedFamilyChart" } }))}
                    >
                        <i className="ri-refresh-line" />
                    </Button>
                }
            </div>
        </div >
    );
};

export default ChartSideBar;

// Render Button Groups as a component or within existing component

