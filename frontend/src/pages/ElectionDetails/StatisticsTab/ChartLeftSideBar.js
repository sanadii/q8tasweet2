import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';

import { ButtonGroup, Button, Label, Input } from "reactstrap";
import Select from "react-select";

const ChartLeftSideBar = ({
    handleFamilySelectionChange,
    setOptions,
    options
}) => {
    const { electorsByFamily, electorsByArea } = useSelector(electorSelector);

    const [selectedFamilyView, setSelectedFamilyView] = useState('قبائل');
    const familyOptions = useMemo(() => (
        electorsByFamily && electorsByFamily.categories.map(category => ({ label: `${category} - ${category} ناخب`, value: category })) || []
    ), [electorsByFamily]);

    const areaOptions = useMemo(() => (
        electorsByArea?.categories.map(category => ({ label: `${category} - ${category} ناخب`, value: category }))
    ), [electorsByArea]);

    return (
        <div className="chat-leftsidebar bg-light">
            <div className="px-2 pt-2 mb-2">
                {options.selected.currentView === "electorsByFamily" &&
                    <div className="mb-3 gy-4">
                        <h5><b>الناخبين حسب القبائل \ العوائل</b></h5>
                        <div className="selectFamilyView">
                            <ButtonGroup className="mt-2 material-shadow w-100">
                                <Button
                                    color="soft-danger"
                                    className={`material-shadow-none ${selectedFamilyView === 'قبائل' ? 'active' : ''}`}
                                    onClick={() => setSelectedFamilyView('قبائل')}
                                >
                                    قبائل
                                </Button>
                                <Button
                                    color="soft-danger"
                                    className={`material-shadow-none ${selectedFamilyView === 'أفخاذ' ? 'active' : ''}`}
                                    onClick={() => setSelectedFamilyView('أفخاذ')}
                                >
                                    أفخاذ
                                </Button>
                            </ButtonGroup>
                        </div>
                        {selectedFamilyView !== "قبائل" &&
                            <>
                                <div>
                                    <Label for="familySelect">إختر القبيلة</Label>
                                    <Select
                                        id="familySelect"
                                        value={options.selected.family}
                                        onChange={(value) => handleFamilySelectionChange('family', value)}
                                        options={familyOptions}
                                        classNamePrefix="select"
                                    />
                                </div>

                                <div>
                                    <Label for="familySelect">إختر الأفخاذ</Label>
                                    <Select
                                        id="familySelect"
                                        value={options.selected.family_divition}
                                        onChange={(value) => handleFamilySelectionChange('family_divition', value)}
                                        options={familyOptions}
                                        classNamePrefix="select"
                                    />
                                </div>
                            </>
                        }
                        {selectedFamilyView === "قبائل" &&
                            <div>
                                <Label for="familySelect">إختر القبائل</Label>
                                <Select
                                    id="familySelect"
                                    value={options.selected.families}
                                    isMulti
                                    onChange={selectedOptionArray => handleFamilySelectionChange('families', selectedOptionArray)}
                                    options={familyOptions}
                                    classNamePrefix="select"
                                />
                            </div>
                        }

                        <div className="mt-3 mt-sm-0">
                            <Label for="areaSelect">المناطق</Label>
                            <Select
                                id="areaSelect"
                                value={options.selected.areas}
                                isMulti
                                onChange={selectedOptionArray => handleFamilySelectionChange('areas', selectedOptionArray)}
                                options={areaOptions}
                                classNamePrefix="select"
                            />
                        </div>
                    </div>
                }

                <div className="mb-3">
                    <h5><b>تصنيف</b></h5>
                    <div className="form-check form-switch form-check-right form-switch-sm">
                        <Label for="genderSwitch">ذكور \ إناث</Label>
                        <Input
                            id="genderSwitch"
                            type="checkbox"
                            checked={options.selected.resultByGender}
                            onChange={(e) => setOptions(prev => ({
                                ...prev,
                                selected: {
                                    ...prev.selected,
                                    resultByGender: e.target.checked
                                }
                            }))}
                            switch
                        />
                    </div>
                </div>
                <div>
                    <Label for="resultCount">عرض النتائج</Label>
                    <Input
                        id="resultCount"
                        type="select"
                        value={options.selected.resultsToDisplay}
                        onChange={(e) => setOptions(prev => ({
                            ...prev,
                            selected: {
                                ...prev.selected,
                                resultsToDisplay: e.target.value
                            }
                        }))}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                    </Input>
                </div>
                <div className="hstack gap-2 mt-4 mt-sm-0">
                    {options.detailedChart.familyChart &&
                        <Button
                            color="primary"
                            className="btn-icon material-shadow-none"
                            title="إعادة تعيين القبائل"
                            outline
                            onClick={() => setOptions(prev => ({ ...prev, detailedChart: { ...prev.detailedChart, familyChart: false } }))}
                        >
                            <i className="ri-refresh-line" />
                        </Button>
                    }
                </div>
            </div>
        </div>
    );
};

export default ChartLeftSideBar;
