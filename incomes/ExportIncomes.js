import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { exportIncomes } from '../../api/rest';

const ExportIncomes = () => {
    const doExportAll = async (event) => {
        event.preventDefault();
        exportIncomes();
    };

    return (
        <div className="mr-3 float-right">
            <FontAwesomeIcon icon={['fas', 'file-export']} className="action-icon" title="Export all incomes" onClick={doExportAll} />
        </div>
    );
}

export default ExportIncomes;
