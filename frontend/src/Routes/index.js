import React from 'react';
import { Routes, Route } from "react-router-dom";

// Layouts
import Layout from "../Layouts";

// Routes
import { AuthProtectedRoutes, DashboardRoutes, CampaignRoutes, PublicRoutes } from "./AllRoutes";
import { AuthProtected } from './AuthProtected';

const routeConfig = [
    {
        routes: PublicRoutes,
        isAuthProtected: false,
    },
    {
        routes: DashboardRoutes,
        layout: "vertical",
        isAuthProtected: true,
    },
    {
        routes: AuthProtectedRoutes,
        isAuthProtected: true,
    },
    {
        routes: CampaignRoutes,
        layout: "vertical",
        isAuthProtected: true,
        style: "campaign",
    },
];

const renderRoute = ({ routes, layout, isAuthProtected, style }, idx) => (
    <React.Fragment key={idx}>
        {routes.map((route, routeIdx) => (
            <Route
                key={routeIdx}
                path={route.path}
                element={
                    isAuthProtected ? (
                        <AuthProtected>
                            {layout ? (
                                <Layout defaultLayout={layout} style={style}>
                                    {route.component}
                                </Layout>
                            ) : (
                                route.component
                            )}
                        </AuthProtected>
                    ) : (
                        layout ? (
                            <Layout defaultLayout={layout}>
                                {route.component}
                            </Layout>
                        ) : (
                            route.component
                        )
                    )
                }
            />
        ))}
    </React.Fragment>
);

const Index = () => {
    return (
        <React.Fragment>
            <Routes>
                {routeConfig.map(renderRoute)}
            </Routes>
        </React.Fragment>
    );
};

export default Index;
