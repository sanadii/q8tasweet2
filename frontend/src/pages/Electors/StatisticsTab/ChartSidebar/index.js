import React from "react";
import SidebarFields from "./SidebarFields"
import SidebarButtons from "./SidebarButtons"

const ChartSideBar = ({
    handleFamilyAreaChange,
    setViewState,
    viewState
}) => {

    return (
        <div className="chat-leftsidebar bg-light">
            <div className="px-2 pt-2 mb-2">
                <SidebarFields
                    viewState={viewState}
                    setViewState={setViewState}
                    handleFamilyAreaChange={handleFamilyAreaChange}
                />
                <SidebarButtons
                    handleFamilyAreaChange={handleFamilyAreaChange}
                    setViewState={setViewState}
                    viewState={viewState}
                />s
            </div>
        </div >
    );
};

export default ChartSideBar;

// Render Button Groups as a component or within existing component

