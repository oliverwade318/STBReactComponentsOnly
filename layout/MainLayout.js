import React, { useState } from "react";
import NavigationBar from "../../shared/NavigationBar";

function MainLayout({ children }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div className={"app-navbar fixed-top " + (open ? "app-navbar-110" : "app-navbar-55")}>
                <NavigationBar callback={setOpen.bind(this)} />
            </div>

            <div className={"container-fluid  " + (open ? "app-navbar-body-110" : "app-navbar-body-55")}>
                {children}
            </div>
        </div>
    );
}

export default MainLayout;
