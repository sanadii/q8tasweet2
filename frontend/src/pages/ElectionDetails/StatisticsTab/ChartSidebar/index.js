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
    const { resultsToShow, displayByGender, displayByOption, displayWithoutOption, displayWithOption, swapView } = viewSettings


    const handleDisplayByGenderSelection = useCallback((option) => () => {
        setViewState(prevState => ({
            ...prevState,
            viewSettings: {
                ...prevState.viewSettings,
                displayByGender: option
            }
        }));
    }, [setViewState]);
    


    const handleDisplayByOptionSelection = useCallback((option) => () => {
        setViewState(prevState => ({
            ...prevState,
            viewSettings: {
                ...prevState.viewSettings,
                displayByOption: option
            }
        }));
    }, [setViewState]);
    
    const handleDisplayWithoutOptionToggle = useCallback((option) => () => {

        setViewState(prevState => ({
            ...prevState,
            viewSettings: {
                ...prevState.viewSettings,
                displayWithoutOption: option
            }
        }));
        
    }, [setViewState]);
    
    const handleDisplayWithOptionToggle = useCallback((option) => () => {

        setViewState(prevState => {
            const currentOptions = prevState.viewSettings.displayWithOption;
            const newOptions = currentOptions.includes(option)
                ? currentOptions.filter(item => item !== option)  // Remove the option if it's already included
                : [...currentOptions, option];  // Add the option if it's not included
    
            return {
                ...prevState,
                viewSettings: {
                    ...prevState.viewSettings,
                    displayWithOption: newOptions
                }
            };

        });

    }, [setViewState]);

        
    const handleDisplayOptionToggle = useCallback((option) => () => {
        if (displayByOption) {
            handleDisplayWithOptionToggle(option)();  // Notice the double call
        } else {
            handleDisplayWithoutOptionToggle(option)();  // Notice the double call
        }
    }, [displayByOption, handleDisplayWithOptionToggle, handleDisplayWithoutOptionToggle]);
        


    const getDisplayBySelectionIcon = useCallback((option) => {
        if (displayByOption) {
            return displayWithOption.includes(option) ? "mdi mdi-sticker-check" : "mdi mdi-sticker-remove";
        } else {
            return displayWithoutOption === option ? "mdi mdi-check-all" : "mdi mdi-dots-horizontal";
        }
    }, [displayByOption, displayWithOption, displayWithoutOption]);
    


    const handleDisplayChartToggle = useCallback((option) => () => {
        setViewState(prevState => ({
            ...prevState,
            viewSettings: {
                ...prevState.viewSettings,
                displayChartType: option
            }
        }));
    }, [setViewState]);

    

    // Constants for button configurations
    const displayByGenderButtons = useMemo(() => [
        {
            text: "الكل",
            icon: displayByGender ? "mdi mdi-dots-horizontal" : "mdi mdi-check-all",
            isActive: displayByGender === false, // Ensure this correctly checks the boolean state
            onClick: handleDisplayByGenderSelection(false),
        },
        {
            text: "ذكور \\ إناث",
            icon: displayByGender ? "mdi mdi-check-all" : "mdi mdi-dots-horizontal",
            isActive: displayByGender === true,
            onClick: handleDisplayByGenderSelection(true),
        },
    ], [displayByGender, handleDisplayByGenderSelection]);
    
    const displayBySelectionButtons = useMemo(() => [
        {
            text: "بدون تحديد",
            icon: displayByOption ? "mdi mdi-dots-horizontal" : "mdi mdi-check-all",
            isActive: displayByOption === false,
            onClick: handleDisplayByOptionSelection(false),
        },
        {
            text: "مع التحديد",
            icon: displayByOption ? "mdi mdi-check-all" : "mdi mdi-dots-horizontal",
            isActive: displayByOption === true,
            onClick: handleDisplayByOptionSelection(true),
        },
    ], [displayByOption, handleDisplayByOptionSelection]);



   
    // console.log("displayByOption:", displayByOption, "displayWithOption: ", displayWithOption, "true?: ", displayWithOption.includes("branch"))
    // // mdi mdi-sticker-remove
    // // mdi mdi-sticker-minus
    // // mdi mdi-sticker-check



    // const displayByFieldButtons2 = useMemo(() => [
    //     {
    //         text: "العوائل",
    //         icon: displayByOption ? "mdi mdi-dots-horizontal" : "mdi mdi-check-all",
    //         isActive: displayByOption === false,
    //         onClick: handleDisplayByOptionSelection(false),
    //     },
    //     { 
    //         text: "المناطق",
    //         icon: displayByOption ? "mdi mdi-dots-horizontal" : "mdi mdi-check-all",
    //         isActive: displayByOption === false,
    //         onClick: handleDisplayByOptionSelection(false),
    //     },
    //     {
    //         icon: displayByOption ? "mdi mdi-dots-horizontal" : "mdi mdi-check-all",
    //         isActive: displayByOption === false,
    //         onClick: handleDisplayByOptionSelection(false),
    //     },
    // ], [displayByOption, displayWithOption, displayWithoutOption, getDisplayBySelectionIcon, handleDisplayOptionToggle]);



    
    const displayByFieldButtons = useMemo(() => {
        const options = ["branches", "areas", "committees"];
        const optionLabels = {
            branches: "العوائل",
            areas: "المناطق",
            committees: "اللجان"
        };

        return options.map(option => ({
            text: optionLabels[option],
            icon: getDisplayBySelectionIcon(option),
            isActive: displayByOption ? displayWithOption.includes(option) : displayWithoutOption === option,
            onClick: handleDisplayOptionToggle(option),
        }));
    }, [displayByOption, displayWithOption, displayWithoutOption, getDisplayBySelectionIcon, handleDisplayOptionToggle]);
    
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
    
    const renderButtonGroup = (buttonConfigs) => (
        <ButtonGroup vertical className="w-100 pb-1">
            {buttonConfigs.map((btn, index) => (
                <Button
                    key={index}
                    className={`w-100 btn-label btn-sm material-shadow-none ${btn.isActive ? "bg-primary " : "bg-light text-primary"}`}
                    onClick={btn.onClick}
                    active={btn.isActive}
                >
                    <i className={`${btn.icon} label-icon align-middle fs-16 me-2`}></i>
                    {btn.text}
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
                        viewDetails={viewDetails}
                        selectionFilters={selectionFilters}
                        handleFamilyAreaChange={handleFamilyAreaChange}
                    />
                }
                <div className="view-settings">
                    {renderButtonGroup(displayByGenderButtons)}
                    {renderButtonGroup(displayBySelectionButtons)}
               {/* <div className="d-flex"> */}
               <Row>
                <Col lg={9}>
                {renderButtonGroup(displayByFieldButtons)}

                </Col>
                <Col lg={3}>
                <Button color="warning" outline className="w-100 btn-sm custom-toggle active"
                    // onClick={(e) => favouriteBtn(e.target)}
                    >
                    <span className="icon-on"><i className="mdi mdi-swap-horizontal align-bottom"></i></span>
                    <span className="icon-off"><i className="mdi mdi-swap-horizontal align-bottom"></i></span>
                </Button>
                </Col>
               </Row>

                    {/* <Button color="warning" outline className="btn-sm custom-toggle active"
                    // onClick={(e) => favouriteBtn(e.target)}
                    >
                    <span className="icon-on"><i className="mdi mdi-swap-horizontal align-bottom"></i></span>
                    <span className="icon-off"><i className="mdi mdi-swap-horizontal align-bottom"></i></span>
                </Button> */}
               {/* </div> */}
               {renderChartButtonGroup(displayChartButtons)}



</div>
                {/* <div>
                    <h5><b>تصنيف</b></h5>
                    <Label for="genderSwitch">ذكور \ إناث</Label>
                    <Input
                        id="genderSwitch"
                        type="checkbox"
                        checked={viewSettings.filterByGender}
                        onChange={(e) => setViewState(prev => ({
                            ...prev,
                            viewSettings: {
                                ...prev.viewSettings,
                                filterByGender: e.target.checked
                            }
                        }))}
                        switch
                    />
                </div>
                <div>
                    <Label for="resultCount">عرض النتائج</Label>
                    <Input
                        id="resultCount"
                        type="select"
                        value={viewSettings.resultsToShow}
                        onChange={(e) => setViewState(prev => ({
                            ...prev,
                            viewSettings: {
                                ...prev.viewSettings,
                                resultsToShow: e.target.value
                            }
                        }))}
                    >
                        {["5", "10", "15", "20", "25"].map(count => <option key={count} value={count}>{count}</option>)}
                    </Input>
                </div> */}
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



const ChartSideBarAreaView = () => { }
const ChartSideBarCommitteeView = () => { }


// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { electionSelector, electorSelector } from 'selectors';

// import { ButtonGroup, Button, Label, Input } from "reactstrap";
// import Select from "react-select";

// const ChartSideBar = ({
//     handleFamilyAreaChange,
//     setViewState,
//     viewState
// }) => {
//     const { electorsByFamily, electorsByArea } = useSelector(electorSelector);

//     const [selectedFamilyView, setSelectedFamilyView] = useState('قبائل');
//     const familyOptions = useMemo(() => (
//         electorsByFamily && electorsByFamily.categories.map(category => ({ label: `${category} - ${category} ناخب`, value: category })) || []
//     ), [electorsByFamily]);

//     const areaOptions = useMemo(() => (
//         electorsByArea?.categories.map(category => ({ label: `${category} - ${category} ناخب`, value: category }))
//     ), [electorsByArea]);

//     return (
//         <div className="chat-leftsidebar bg-light">
//             <div className="px-2 pt-2 mb-2">
//                 {viewState.selected.activeView === "electorsByFamily" &&
//                     <div className="mb-3 gy-4">
//                         <h5><b>الناخبين حسب القبائل \ العوائل</b></h5>
//                         <div className="selectFamilyView">
//                             <ButtonGroup className="mt-2 material-shadow w-100">
//                                 <Button
//                                     color="soft-danger"
//                                     className={`material-shadow-none ${selectedFamilyView === 'قبائل' ? 'active' : ''}`}
//                                     onClick={() => setSelectedFamilyView('قبائل')}
//                                 >
//                                     قبائل
//                                 </Button>
//                                 <Button
//                                     color="soft-danger"
//                                     className={`material-shadow-none ${selectedFamilyView === 'أفخاذ' ? 'active' : ''}`}
//                                     onClick={() => setSelectedFamilyView('أفخاذ')}
//                                 >
//                                     أفخاذ
//                                 </Button>
//                             </ButtonGroup>
//                         </div>
//                         {selectedFamilyView !== "قبائل" &&
//                             <>
//                                 <div>
//                                     <Label for="familySelect">إختر القبيلة</Label>
//                                     <Select
//                                         id="familySelect"
//                                         value={viewState.selected.family}
//                                         onChange={(value) => handleFamilyAreaChange('family', value)}
//                                         viewState={familyOptions}
//                                         classNamePrefix="select"
//                                     />
//                                 </div>

//                                 <div>
//                                     <Label for="familySelect">إختر الأفخاذ</Label>
//                                     <Select
//                                         id="familySelect"
//                                         value={viewState.selected.family_divition}
//                                         onChange={(value) => handleFamilyAreaChange('family_divition', value)}
//                                         viewState={familyOptions}
//                                         classNamePrefix="select"
//                                     />
//                                 </div>
//                             </>
//                         }
//                         {selectedFamilyView === "قبائل" &&
//                             <div>
//                                 <Label for="familySelect">إختر القبائل</Label>
//                                 <Select
//                                     id="familySelect"
//                                     value={viewState.selected.families}
//                                     isMulti
//                                     onChange={selectedOptionArray => handleFamilyAreaChange('families', selectedOptionArray)}
//                                     viewState={familyOptions}
//                                     classNamePrefix="select"
//                                 />
//                             </div>
//                         }

//                         <div className="mt-3 mt-sm-0">
//                             <Label for="areaSelect">المناطق</Label>
//                             <Select
//                                 id="areaSelect"
//                                 value={viewState.selected.areas}
//                                 isMulti
//                                 onChange={selectedOptionArray => handleFamilyAreaChange('areas', selectedOptionArray)}
//                                 viewState={areaOptions}
//                                 classNamePrefix="select"
//                             />
//                         </div>
//                     </div>
//                 }

//                 <div className="mb-3">
//                     <h5><b>تصنيف</b></h5>
//                     <div className="form-check form-switch form-check-right form-switch-sm">
//                         <Label for="genderSwitch">ذكور \ إناث</Label>
//                         <Input
//                             id="genderSwitch"
//                             type="checkbox"
//                             checked={viewState.selected.resultByGender}
//                             onChange={(e) => setViewState(prev => ({
//                                 ...prev,
//                                 selected: {
//                                     ...prev.selected,
//                                     resultByGender: e.target.checked
//                                 }
//                             }))}
//                             switch
//                         />
//                     </div>
//                 </div>
//                 <div>
//                     <Label for="resultCount">عرض النتائج</Label>
//                     <Input
//                         id="resultCount"
//                         type="select"
//                         value={viewState.selected.resultsToDisplay}
//                         onChange={(e) => setViewState(prev => ({
//                             ...prev,
//                             selected: {
//                                 ...prev.selected,
//                                 resultsToDisplay: e.target.value
//                             }
//                         }))}
//                     >
//                         <option value="5">5</option>
//                         <option value="10">10</option>
//                         <option value="15">15</option>
//                         <option value="20">20</option>
//                         <option value="25">25</option>
//                     </Input>
//                 </div>
//                 <div className="hstack gap-2 mt-4 mt-sm-0">
//                     {viewState.detailedChart.familyChart &&
//                         <Button
//                             color="primary"
//                             className="btn-icon material-shadow-none"
//                             title="إعادة تعيين القبائل"
//                             outline
//                             onClick={() => setViewState(prev => ({ ...prev, detailedChart: { ...prev.detailedChart, familyChart: false } }))}
//                         >
//                             <i className="ri-refresh-line" />
//                         </Button>
//                     }
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChartSideBar;


//                         {/* mdi-bookmark-remove mdi-bookmark-outline mdi-bookmark-plus-outline
//                         mdi-bookmark-check mdi-bookmark mdi-bookmark-minus mdi-bookmark-plus
//                         mdi-checkbox-blank-circle mdi-checkbox-marked-circle


//                         mdi-plus-circle

                        
//                         mdi-layers-off mdi-layers
//  mdi-layers-outline mdi-layers-plus mdi-layers-minus
//  mdi-clipboard-flow
// mdi-clipboard-flow-outline

//  mdi-sticker
// mdi-sticker-alert
// mdi-sticker-alert-outline
// mdi-sticker-check
// mdi-sticker-check-outline
// mdi-sticker-circle-outline
// mdi-sticker-emoji
// mdi-sticker-minus
// mdi-sticker-minus-outline
// mdi-sticker-outline
// mdi-sticker-plus
// mdi-sticker-plus-outline
// mdi-sticker-remove
// mdi-sticker-remove-outline
// mdi-sticker-text
// mdi-sticker-text-outline


// mdi-filter
// mdi-filter-check
// mdi-filter-check-outline
// mdi-filter-menu
// mdi-filter-menu-outline
// mdi-filter-minus
// mdi-filter-minus-outline
// mdi-filter-off
// mdi-filter-off-outline
// mdi-filter-outline
// mdi-filter-plus
// mdi-filter-plus-outline
// mdi-filter-remove
// mdi-filter-remove-outline
//  */}





