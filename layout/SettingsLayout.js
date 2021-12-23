import React from "react";
import SettingsHeader from "./SettingsHeader";

function SettingsLayout({ children }) {
    return (
        <div>
            <SettingsHeader />

            <div className="container-fluid app-navbar-body-210">
                {children}
            </div>
        </div>
    );
}

export default SettingsLayout;
