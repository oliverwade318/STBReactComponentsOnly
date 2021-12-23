import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { exportUsers } from '../../api/rest';

const ExportUsers = () => {
    const doExportAll = async (event) => {
        event.preventDefault();
        exportUsers();
    };

    return (
        <div className="mr-3 float-right">
            <FontAwesomeIcon icon={['fas', 'file-export']} className="action-icon" title="Export all incomes" onClick={doExportAll} />
        </div>
    );
}

export default ExportUsers;
