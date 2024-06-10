import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ButtonGroup, Button } from "reactstrap";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';



const ChartSideBar = ({
    handleFamilyAreaChange,
    setViewState,
    viewState
}) => {
    const { electionSlug, electionDetails } = useSelector(electionSelector);
    const isElectorAddress = electionDetails?.isElectorAddress
    const isElectorCommittee = electionDetails?.isElectorCommittee

    const { selectionFilters, viewSettings } = viewState;
    const { displayAllElectors, familyBranchOption, areaCommitteeOption, reverseView, displayChartType } = viewSettings

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


    const handleDisplayViewOptionToggle = useCallback((optionType) => () => {
        setViewState(prevState => ({
            ...prevState,
            viewSettings: {
                ...prevState.viewSettings,
                [optionType]: !prevState.viewSettings[optionType] // Toggle the boolean value
            }
        }));
    }, [setViewState]);


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
                    onClick: handleDisplayByOptionSelection("areaCommitteeOption", ""),
                    display: isElectorAddress || isElectorCommittee,

                },
                {
                    text: "المناطق",
                    icon: areaCommitteeOption === "area" ? "mdi mdi-checkbox-marked-circle-outline" : "mdi mdi-checkbox-blank-circle-outline",
                    isActive: areaCommitteeOption === "area",
                    onClick: handleDisplayByOptionSelection("areaCommitteeOption", "area"),
                    display: isElectorAddress,

                },
                {
                    text: "اللجان",
                    icon: areaCommitteeOption === "committee" ? "mdi mdi-checkbox-marked-circle-outline" : "mdi mdi-checkbox-blank-circle-outline",
                    isActive: areaCommitteeOption === "committee",
                    onClick: handleDisplayByOptionSelection("areaCommitteeOption", "committee"),
                    display: isElectorCommittee,
                },
            ]
        }
    ], [areaCommitteeOption, familyBranchOption, handleDisplayByOptionSelection]);


    const displayChartButtons = useMemo(() => [

        {
            icon: "mdi mdi-chart-bar",
            color: "soft-danger",
            isActive: displayChartType === "bar",

            onClick: handleDisplayChartToggle("bar"),
        },
        {
            icon: "mdi mdi-chart-pie",
            color: "soft-primary",
            isActive: displayChartType === "pie",
            onClick: handleDisplayChartToggle("pie"),
        },
        {
            icon: "mdi mdi-chart-line",
            color: "soft-success",
            isActive: displayChartType === "line",
            onClick: handleDisplayChartToggle("line")
        },
        {
            icon: "mdi mdi-apps",
            color: "soft-success",
            isActive: displayChartType === "heatMap",
            onClick: handleDisplayChartToggle("heatMap")
        },
        {
            icon: "mdi mdi-chart-bubble",
            color: "soft-secondary",
            isActive: displayChartType === "bubble",
            onClick: handleDisplayChartToggle("bubble")
        },

    ], [displayChartType, handleDisplayChartToggle]);


    const displayOptionButtons = useMemo(() => [
        {
            icon: "mdi mdi-swap-horizontal",
            color: "soft-danger",
            text: "تبديل",
            isActive: reverseView === true,
            onClick: handleDisplayViewOptionToggle("reverseView"),
            display: isElectorAddress || isElectorCommittee,
        },
        {
            icon: "mdi mdi-gender-transgender",
            color: "soft-secondary",
            text: "ذكور / إناث",
            onClick: handleDisplayViewOptionToggle("displayByGender")
        },

    ], [reverseView, handleDisplayViewOptionToggle]);

    const renderButtonGroup = (buttonConfigs, color) => (
        <ButtonGroup className="w-100 pb-1">
            {buttonConfigs.map((btn, index) => (
                (btn.display !== false) && (
                    <Button
                        key={index}
                        className={`${btn.text ? "btn-label" : "btn-icon"} btn-sm material-shadow-none ${btn.isActive ? `bg-${color} ` : `bg-light text-${color}`}`}
                        onClick={btn.onClick}
                        active={btn.isActive}
                    >
                        {btn.text ? (
                            <>
                                <i className={`${btn.icon} label-icon align-middle fs-16 me-2`}></i>
                                {btn.text}
                            </>
                        ) : (
                            <i className={`${btn.icon} label-icon align-middle fs-16`}></i>
                        )}
                    </Button>
                )
            ))}
        </ButtonGroup>
    );


    const renderChartButtonGroup = (buttonConfigs, isIconOnly = false) => (
        <ButtonGroup className="w-100 pb-1">
            {buttonConfigs.map((btn, index) => (
                (btn.display !== false) && (

                    <Button
                        key={index}
                        color={btn.color}
                        className={`btn-icon material-shadow-none"}`}
                        onClick={btn.onClick}
                        active={btn.isActive}
                    >
                        <i className={`${btn.icon} label-icon align-middle fs-16 me-2
                    
                    `}></i>
                        {btn.text}
                    </Button>
                )
            ))}

        </ButtonGroup>

    );

    return (

        <React.Fragment>
            <div className="view-settings">
                {/* Add success color */}
                {renderButtonGroup(displayBySelectionButtons, 'danger')}


                {
                    displayBySelectedOptions.map((optionGroup, index) => (
                        <div key={index}>
                            {
                                renderButtonGroup(optionGroup.items, optionGroup.color)
                            }
                        </div>
                    ))
                }


                {/* {renderButtonGroup(displayByAreaCommitteeButtons, 'primary')} */}

                {renderChartButtonGroup(displayChartButtons)}
                {renderChartButtonGroup(displayOptionButtons)}


            </div>
            {viewSettings.xx === "detailedFamilyChart" &&
                <Button
                    color="primary"
                    className="btn-icon material-shadow-none"
                    title="إعادة تعيين القبائل"
                    outline
                    onClick={() => setViewState(prev => ({ ...prev, viewSettings: { ...prev.viewSettings, xx: "detailedFamilyChart" } }))}
                >
                    <i className="ri-refresh-line" />
                </Button>
            }
        </React.Fragment>

    );
};

export default ChartSideBar;

// Render Button Groups as a component or within existing component

