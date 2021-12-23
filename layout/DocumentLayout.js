import React from "react";
import DocumentHeader from './DocumentHeader';

function DocumentLayout({ children }) {
    return (
        <div>
            <DocumentHeader />

            <div className="container-fluid app-navbar-body-55 font-16 font-black">
                {children}
            </div>
        </div>
    );
};

export default DocumentLayout;
