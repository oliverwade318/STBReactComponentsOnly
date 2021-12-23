import React from "react";
import { useNavigate, useLocation } from "@reach/router";
import NavigationBar from "../../shared/NavigationBar";

const SettingsHeader = () => {

    const navigate = useNavigate()
    const location = useLocation();

    return (
        <div className="app-navbar app-navbar-210 fixed-top">
            <NavigationBar />

            <span className="font-30 font-white fixed-top" style={{
                fontWeight: "600",
                marginLeft: "16px",
                marginTop: "100px",
                width: "150px",
            }}>
                Settings
            </span>

            <div className="fixed-top" style={{
                fontWeight: "600",
                marginLeft: "16px",
                marginTop: "172px",
                width: "250px"
            }}>
                <a onClick={() => { navigate('/settings/profile') }} className="mr-5 app-clickable">
                    <span className={"font-22 menu-text " + (location.pathname !== "/settings/profile" ? "menu-text-notactive": "")}>
                        Profile
                    </span>
                </a>
                <a onClick={() => { navigate('/settings/change') }} className="mr-5 app-clickable">
                    <span className={"font-22 menu-text " + (location.pathname !== "/settings/change" ? "menu-text-notactive": "")}>
                        Password
                    </span>
                </a>
                <a onClick={() => { navigate('/settings/tax-calculator') }} className="app-clickable">
                    <span className={"font-22 menu-text " + (location.pathname !== "/settings/tax-calculator" ? "menu-text-notactive": "")}>
                        Tax
                    </span>
                </a>
            </div>
        </div>
    )
};

export default SettingsHeader;
