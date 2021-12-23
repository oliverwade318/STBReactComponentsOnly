import React, { useState, useContext } from "react";
import {
    Card, CardHeader, CardBody, CardFooter, CardSubtitle
} from 'reactstrap';
import NumberFormat from 'react-number-format';
import CONSTANTS from "../../shared/Constants";
import { stateTaxData } from '../../shared/statesTax';

const stateList = CONSTANTS.stateList;

const TaxCalculator = () => {
    const [state, setState] = useState('AL');
    const [fillingStatus, setFillingStatus] = useState('single');
    const [income, setIncome] = useState('');
    const [haveW2, setHaveW2] = useState(false);
    const [w2Income, setW2Income] = useState('');
    const [socialSecurity, setSocialSecurity] = useState(0);
    const [medicare, setMedicare] = useState(0);
    const [federal, setFederal] = useState(0);
    const [stateTax, setStateTax] = useState(0);

    const onChangeHandler = event => {
        const { name, value, checked } = event.currentTarget;
        if (name === "state") {
            setState(value);
        } else if (name === "fillingStatus") {
            setFillingStatus(value);
        } else if (name === "income") {
            setIncome(value);
        } else if (name === "haveW2") {
            setHaveW2(checked);
        }
        else if (name === "w2Income") {
            setW2Income(value);
        }
    };

    const roundNumber = (value) => {
        return Math.round(value * 100) / 100;
    }

    const calculate = (event) => {
        event.preventDefault();
        event.persist();
        if ((income.length < 1) || (haveW2 && w2Income.length < 1)) return;
        const incomeNumber = parseFloat(income) + parseFloat(haveW2 ? w2Income : '0');
        const socialSecurityTax = parseFloat(income) * CONSTANTS.selfEmploymentTaxRate.socialSecurity / 100;
        const medicareTax = parseFloat(income) * CONSTANTS.selfEmploymentTaxRate.medicare / 100;
        const federalRateData = CONSTANTS.federalTaxData[fillingStatus];
        const stateRateData = stateTaxData[state] ? stateTaxData[state][fillingStatus] : null;
        const federalTax = calculateFederalTax(federalRateData, incomeNumber);
        const stateTax1 = stateRateData ? calculateFederalTax(stateRateData, incomeNumber) : 0;
        setSocialSecurity(socialSecurityTax);
        setMedicare(medicareTax);
        setFederal(federalTax);
        setStateTax(stateTax1);
    }

    const calculateFederalTax = (rateData, incomeNumber) => {
        let value = 0;
        for (const key of Object.keys(rateData)) {
            if (parseFloat(incomeNumber) < parseFloat(key)) {
                break;
            } else {
                value = rateData[key].amount + (incomeNumber - key) * rateData[key].percent / 100;
            }
        };
        return value;
    }

    const descriptionComponent = () => (
        <div className="row mt-4">
            <div className="app-responsive-form description-wrapper pl-3 pr-3">
                <div className="font-weight-bold">How does the calculator work?</div>
                <div className="mt-2">
                    Visibility into how much you may potentially owe in taxes is important.
                    This calculator estimates your federal and state-level income tax based on your filing status.
                    You have the option to select 1099 or W2 income, or both!
                </div>
                <div className="mt-2">
                    To simplify the experience, please note the following:
                </div>
                <ul>
                    <li className="mt-2">
                        Non-standard tax credits are not accounted for.
                        Most notably, child and education expenses are not factored in.
                        This calculator is intended to provide an estimate and you may be required to pay less if you qualify for tax credits.
                    </li>
                    <li className="mt-2">
                        The calculator assumes you take the standard deduction.
                        With the Tax Cuts and Jobs Act of 2017, this is fine for the vast majority of Americans.
                        If you have significant charitable, medical, or other personal itemized deductions then you will be overpaying.
                    </li>
                    <li className="mt-2 font-italic">
                        STB is not in the business of providing legal, financial, accounting, tax, health care, real estate or other professional services or advice.
                        Consult the services of a competent professional when you need this type of assistance.
                    </li>
                </ul>
            </div>
        </div>
    )
    
    return (
        <div>
            <div className="row">
                <div className="text-left app-responsive-form col-lg-6 pl-3 pr-3">
                    <form className="form-row mt-4" onSubmit={calculate}>
                        <div className="form-group col-12">
                            <label htmlFor="state" className="control-label font-16 font-gray">
                                Where do you live?
                            </label>
                            <select
                                id="state"
                                name="state"
                                className="form-control"
                                onChange={onChangeHandler}
                                value={state}>
                                {Object.keys(stateList).map((key) => <option key={key} value={key}>{stateList[key]}</option>)}
                            </select>
                        </div>

                        <div className="form-group col-12">
                            <label htmlFor="fillingStatus" className="control-label font-16 font-gray">
                                Tax filing status
                            </label>
                            <select
                                id="fillingStatus"
                                name="fillingStatus"
                                className="form-control"
                                onChange={onChangeHandler}
                                value={fillingStatus}>
                                {CONSTANTS.fillingStatusList.map((status) => <option key={status.key} value={status.key}>{status.value}</option>)}
                            </select>
                        </div>
                        <div className="form-group col-12">
                            <label htmlFor="income" className="control-label font-16 font-gray">
                                Expected 1099 income (annual)
                            </label>
                            <NumberFormat
                                name="income"
                                className="form-control"
                                thousandSeparator={true}
                                prefix={'$'}
                                value={income}
                                onValueChange={(values) => {
                                    const {value} = values;
                                    setIncome(value)
                                }}
                            />
                        </div>
                        <div className="form-group col-12">
                            <div className="form-check d-inline">
                                <input
                                    id="haveW2"
                                    name="haveW2"
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={haveW2}
                                    onChange={onChangeHandler}
                                />
                                <label className="form-check-label font-16 font-gray" htmlFor="haveW2">
                                    I also have W2 (employee) income
                                </label>
                            </div> 
                        </div>
                        {
                            haveW2 &&
                                <div className="form-group col-12">
                                    <label htmlFor="w2Income" className="control-label font-16 font-gray">
                                        What's your W2 salary? (annual)
                                    </label>
                                    <NumberFormat
                                        name="w2Income"
                                        className="form-control"
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        value={w2Income}
                                        onValueChange={(values) => {
                                            const {value} = values;
                                            setW2Income(value);
                                        }}
                                    />
                                </div>
                            }
                        <button className="btn btn-primary main-button main-button-sm" type="submit">
                            Calculate
                        </button>
                    </form>
                    <div className="lg-description-view">
                    {
                        descriptionComponent()
                    }
            </div>
                </div>
                <div className="mt-4 app-responsive-form col-md-6">
                    <Card>
                        <CardHeader className="font-weight-bold">
                            Your Results:
                            <CardSubtitle className="font-14 font-lightgray mt-2">
                                Estimated total Federal & State tax payment due at the end of the year.
                            </CardSubtitle>
                        </CardHeader>
                        <CardBody>
                            <div className="d-flex tax-row">
                                <div className="tax-item">Self Employment Tax</div>
                                <div className="tax-item">
                                    {`$${(socialSecurity + medicare).toLocaleString(undefined, {maximumFractionDigits:2, minimumFractionDigits: 2})}`}
                                </div>
                            </div>
                            <div className="d-flex tax-row ml-4 font-lightgray mr-4">
                                <div className="tax-item">Social Security</div>
                                <div className="tax-item">
                                    {`$${socialSecurity.toLocaleString(undefined, {maximumFractionDigits:2, minimumFractionDigits: 2})}`}
                                </div>
                            </div>
                            <div className="d-flex tax-row ml-4 font-lightgray mr-4">
                                <div className="tax-item">Medicare</div>
                                <div className="tax-item">
                                    {`$${medicare.toLocaleString(undefined, {maximumFractionDigits:2, minimumFractionDigits: 2})}`}
                                </div>
                            </div>
                            <div className="d-flex tax-row mt-4">
                                <div className="tax-item">Federal Tax</div>
                                <div className="tax-item">
                                    {`$${federal.toLocaleString(undefined, {maximumFractionDigits:2, minimumFractionDigits: 2})}`}
                                </div>
                            </div>
                            <div className="d-flex tax-row mt-4">
                                <div className="tax-item">State Tax</div>
                                <div className="tax-item">
                                    {`$${stateTax.toLocaleString(undefined, {maximumFractionDigits:2, minimumFractionDigits: 2})}`}
                                </div>
                            </div>
                        </CardBody>
                        <CardFooter>
                            <div className="d-flex tax-row">
                                <div className="tax-item">Total Tax Estimate</div>
                                <div className="tax-item">
                                    {`$${(socialSecurity + medicare + federal + stateTax).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})}`}
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <div className="md-description-view">
                {
                    descriptionComponent()
                }
            </div>
        </div>
    )
};

export default TaxCalculator;
