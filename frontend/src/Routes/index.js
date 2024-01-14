import React from 'react';
import { Routes, Route } from "react-router-dom";

//Layouts
// import NonAuthLayout from "../Layouts/NonAuthLayout";
import Layout from "../Layouts";

//routes
import { authProtectedRoutes, dashboardRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from './AuthProtected';
import { NonAuthProtected } from './NonAuthProtected';

const Index = () => {
    return (
        <React.Fragment>
            <Routes>
                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <Layout defaultLayout={'horizontal'}>
                                    {route.component}
                                </Layout>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

                <Route>
                    {dashboardRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    <Layout defaultLayout={'vertical'}>
                                        {route.component}
                                    </Layout>
                                </AuthProtected>}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>
                <Route>
                    {authProtectedRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    <Layout>
                                        {route.component}
                                    </Layout>
                                </AuthProtected>}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>
            </Routes>
        </React.Fragment>
    );
};

export default Index;