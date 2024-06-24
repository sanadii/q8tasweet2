import React from 'react';
import { Outlet } from 'react-router-dom';

const CampaignDashboardLayout = () => {
    return (
        <div>
            {/* Common elements like header, sidebar, etc. */}
            <header>Campaign Dashboard Header</header>

            {/* Outlet will render the specific component based on the route */}
            <main>
                <Outlet />
            </main>

            {/* Common footer if needed */}
            <footer>Campaign Dashboard Footer</footer>
        </div>
    );
};

export default CampaignDashboardLayout;
