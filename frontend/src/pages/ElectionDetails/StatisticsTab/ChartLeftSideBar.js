import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { electionSelector, electorSelector } from 'selectors';

import { ButtonGroup, Button, Label, Input } from "reactstrap";
import Select from "react-select";

const ChartLeftSideBar = ({ handleSelectionChange, setSelectedOptions, selectedOptions }) => {
    const { electorsByFamily, electorsByArea } = useSelector(electorSelector);

    const [selectedFamilyView, setSelectedFamilyView] = useState('قبائل');
    const familyOptions = useMemo(() => (
        electorsByFamily.map(elector => ({ label: `${elector.category} - ${elector.total} ناخب`, value: elector.category }))
    ), [electorsByFamily]);

    const areaOptions = useMemo(() => (
        electorsByArea.map(elector => ({ label: `${elector.category} - ${elector.total} ناخب`, value: elector.category }))
    ), [electorsByArea]);

    return (
        <div className="chat-leftsidebar bg-light">
            <div className="px-2 pt-2 mb-2">
                {/* Display Category */}
                <div className="mb-3">
                    <h4>طريقة العرض</h4>

                </div>
                <div className="mt-3 mt-sm-0">
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
                            <div className="">
                                <Label for="familySelect">إختر القبيلة</Label>
                                <Select
                                    id="familySelect"
                                    value={selectedOptions.family}
                                    onChange={handleSelectionChange('family')}
                                    options={familyOptions}
                                    classNamePrefix="select"
                                />
                            </div>

                            <div className="">
                                <Label for="familySelect">إختر الأفخاذ</Label>
                                <Select
                                    id="familySelect"
                                    value={selectedOptions.family_divition}
                                    onChange={handleSelectionChange('family_divition')}
                                    options={familyOptions}
                                    classNamePrefix="select"
                                />
                            </div>
                        </>
                    }
                    {selectedFamilyView === "قبائل" &&
                        <div className="">
                            <Label for="familySelect">إختر القبائل</Label>
                            <Select
                                id="familySelect"
                                value={selectedOptions.families}
                                isMulti
                                onChange={handleSelectionChange('families')}
                                options={familyOptions}
                                classNamePrefix="select"
                            />
                        </div>
                    }

                    <Label for="areaSelect">المناطق</Label>
                    <Select
                        id="areaSelect"
                        value={selectedOptions.areas}
                        isMulti
                        onChange={handleSelectionChange('areas')}
                        options={areaOptions}
                        classNamePrefix="select"
                    />
                </div>
                {/* OnOff & Pagination */}
                <div className="form-check form-switch form-check-right form-switch-sm">
                    <Label for="genderSwitch">ذكور \ إناث</Label>
                    <Input
                        id="genderSwitch"
                        type="checkbox"
                        checked={selectedOptions.resultByGender}
                        onChange={(e) => setSelectedOptions(prev => ({ ...prev, resultByGender: e.target.checked }))}
                        switch
                    />
                </div>
            </div>
            <Label for="resultCount">عرض النتائج</Label>
            <Input
                id="resultCount"
                type="select"
                value={selectedOptions.resultsToDisplay}
                onChange={(e) => setSelectedOptions(prev => ({ ...prev, resultsToDisplay: e.target.value }))}
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
            </Input>

        </div>
    );
};

export default ChartLeftSideBar;
