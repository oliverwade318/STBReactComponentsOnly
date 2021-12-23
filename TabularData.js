import React from "react";
import RemoveIncome from "./incomes/RemoveIncome";
import WriteIncome from "./incomes/WriteIncome";
import './TabularData.css';
import { formatDate } from '../shared/DateUtils';
import { CurrencyHandler, PropertyHandler } from "../shared/HelperHandlers";

const TabularData = (props) => {
    return (
        <div className={`table-block ${props.is_Odd ? 'bg-grey' : 'bg-white'}`}>
            <div>
                <span>Date</span>
                <span>Contact</span>
                <span>Amount</span>
                <span>Payment method</span>
                <span>Source</span>
            </div>
            <div>
                <span>{formatDate(props.income.dateUTC)}</span>
                <span><PropertyHandler propertyId={props.income.contactId} collection={props.theUser.contacts} /></span>
                <span> <CurrencyHandler amount={props.income.originAmount} currency={props.income.currency} /></span>
                <span><PropertyHandler propertyId={props.income.paymentMethodId} collection={props.theUser.paymentMethods} /></span>
                <span><PropertyHandler propertyId={props.income.sourceId} collection={props.theUser.sources} /></span>
            </div>
            <div className="table-block-actions">
                {/* <p>edit</p>
                <p>delete</p> */}
                <WriteIncome forUser={props.theUser} income={props.income} update={true} refresh={props.reload} className="modal-margin" />
                <RemoveIncome forUser={props.theUser} income={props.income} refresh={props.reload} />
            </div>
        </div>
    );
}

export default TabularData;