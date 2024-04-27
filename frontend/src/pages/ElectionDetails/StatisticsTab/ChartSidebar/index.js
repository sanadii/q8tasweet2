import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ButtonGroup, Button, Label, Input } from "reactstrap";
import Select from "react-select";


import { getElectorsByCategory, getElectorsByFamilyDivision } from "store/actions";
import ChartSideBarFamilyView from "./ChartSideBarFamilyView"

const ChartSideBar = ({
    handleFamilyAreaChange,
    setViewState,
    viewState
}) => {
    const { selectionFilters, displaySettings, viewDetails } = viewState;


    return (
        <div className="chat-leftsidebar bg-light">
            <div className="px-2 pt-2 mb-2">
                {displaySettings.activeView === "electorsByFamily" &&
                    <ChartSideBarFamilyView
                        viewState={viewState}
                        setViewState={setViewState}
                        viewDetails={viewDetails}
                        selectionFilters={selectionFilters}
                        handleFamilyAreaChange={handleFamilyAreaChange}
                    />
                }
                <div>
                    <h5><b>تصنيف</b></h5>
                    <Label for="genderSwitch">ذكور \ إناث</Label>
                    <Input
                        id="genderSwitch"
                        type="checkbox"
                        checked={displaySettings.filterByGender}
                        onChange={(e) => setViewState(prev => ({
                            ...prev,
                            displaySettings: {
                                ...prev.displaySettings,
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
                        value={displaySettings.resultsToShow}
                        onChange={(e) => setViewState(prev => ({
                            ...prev,
                            displaySettings: {
                                ...prev.displaySettings,
                                resultsToShow: e.target.value
                            }
                        }))}
                    >
                        {["5", "10", "15", "20", "25"].map(count => <option key={count} value={count}>{count}</option>)}
                    </Input>
                </div>
                {displaySettings.activeView === "detailedFamilyChart" &&
                    <Button
                        color="primary"
                        className="btn-icon material-shadow-none"
                        title="إعادة تعيين القبائل"
                        outline
                        onClick={() => setViewState(prev => ({ ...prev, displaySettings: { ...prev.displaySettings, activeView: "detailedFamilyChart" } }))}
                    >
                        <i className="ri-refresh-line" />
                    </Button>
                }
            </div>
        </div>
    );
};

export default ChartSideBar;



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
