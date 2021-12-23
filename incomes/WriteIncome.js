import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../providers/UserProvider";
import { Button, Modal, ModalHeader, ModalBody, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createIncome, updateIncome } from "../../api/rest";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import AddProperty from "../properties/AddProperty";
import { CurrencyIcon } from '../../shared/HelperHandlers';
import CONSTANTS from "../../shared/Constants";
// import moment from 'moment';

const WriteIncome = (props) => {
    const {
        forUser,
        update,
        income,
        refresh,
        className
    } = props;

    const { user, setLoading } = useContext(UserContext);
    const paymentMethods = Object.assign([], forUser.paymentMethods);
    paymentMethods.map(item => {
        item.type = 'paymentMethod';
        item.value = item.id;
        item.label = item.name;
    });
    const sources = Object.assign([], forUser.sources);
    sources.map(item => {
        item.type = 'source';
        item.value = item.id;
        item.label = item.name;
    });
    const contacts = Object.assign([], forUser.contacts);
    contacts.map(item => {
        item.type = 'contact';
        item.value = item.id;
        item.label = item.name;
    });

    const [modal, setModal] = useState(false);
    
    const toggle = () => {
        setModal(!modal);

        if (!modal) {
            setPaymentMethod(update ? paymentMethods.find(item => item.id === income?.paymentMethodId) : paymentMethods[0]);
            setSource(update ? sources.find(item => item.id === income?.sourceId) : sources[0]);
            setContact(update ? contacts.find(item => item.id === income?.contactId) : contacts[0]);
            setDate(update ? (income?.dateUTC ? new Date(income.dateUTC) : new Date()) : new Date());
            setDateError(null);
            setAmount(update ? income?.originAmount / 100.0 : 0.00);
            setAmountError(null);
        }
    }

    const currencyArray = (strValue) => {
        const strArr = strValue.split(',');
        return CONSTANTS.currencies.filter((item) => strArr.includes(item.key));
    }

    const [paymentMethod, setPaymentMethod] = useState(update ? paymentMethods.find(item => item.id === income?.paymentMethodId) : paymentMethods[0]);
    const [source, setSource] = useState(update ? sources.find(item => item.id === income?.sourceId) : sources[0]);
    const [contact, setContact] = useState(update ? contacts.find(item => item.id === income?.contactId) : contacts[0]);

    const [date, setDate] = useState(update ? (income?.dateUTC ? new Date(income.dateUTC) : new Date()) : new Date());
    const [dateError, setDateError] = useState(null);
    const [amount, setAmount] = useState(update ? income?.amount / 100.0 : 0.00);
    const [amountError, setAmountError] = useState(null);
    const defaultCurrency = CONSTANTS.currencies.find(next => next.key === user.currency);
    const [currency, setCurrency] = useState(update ? CONSTANTS.currencies.find(next => next.key === income.currency) : defaultCurrency);
    const currencyOptions = user.additionalCurrency ? [defaultCurrency].concat(currencyArray(user.additionalCurrency)) : [defaultCurrency];

    function defineIconClasses(theKey) {
        const theCurrency = CONSTANTS.currencies.find(next => next.key === theKey);
        return !!theCurrency ? theCurrency.symbol : CONSTANTS.defaultCurrency.symbol;
    }
    
    const [iconAdditionalClasses, setIconAdditionalClasses] = useState(currency ? currency.symbol : CONSTANTS.defaultCurrency.symbol);

    // React.useEffect(() => {
    //     const cstDate = new Date(`${moment(date).format('YYY-MM-DD HH:mm:ss')} -0500`)
    //     console.log(cstDate)
    // }, [date])

    const onChangeHandler = event => {
        const { name, value, checked } = event.currentTarget;
        if (name === "date") {
            setDate(value);
        } else if (name === "amount") {
            setAmount(value);
        } else if (name === "useAdditional") {
            setUseAdditional(checked);
        }  
    };

    const onSelectChangeHandler = event => {
        if (event.type === "paymentMethod") {
            setPaymentMethod(event);
            if (event.name === 'AVN' || event.name === 'IWC' || event.name === 'SextPanther' || event.name === 'OnlyFans' || event.name === 'Niteflirt') {
                const temp = sources.find(item => item.name === event.name);
                setSource(temp);
            }
        } else if (event.type === "source") {
            setSource(event);
        } else if (event.type === "contact") {
            setContact(event);
        }
    };

    const updateProperty = (collection, property) => {
        if (collection === "paymentMethods") {
            setPaymentMethod(property);
        } else if (collection === "sources") {
            setSource(property);
        } else if (collection === "contacts") {
            setContact(property);
        }
        
    }

    const createNewIncome = async (event) => {
        event.preventDefault();
        let error = false;
        setAmountError(null);
        setDateError(null);
        if (!amount || amount <= 0) {
            error = true;
            setAmountError('Amount should be a positive number');
        }
        if (!date) {
            error = true;
            setDateError('Date should be a valid one');
        }
        if (error) {
            return;
        }

        try {
            // const cstDate = new Date(`${moment(date).format('YYY-MM-DD HH:mm:ss')} -0500`)
            setLoading(true);
            const result = update
                ? await updateIncome(income.id, {
                    paymentMethodId: paymentMethod.id, contactId: contact.id, sourceId: source.id,
                    amount: Math.round((+amount) * 100),
                    currency: currency.value,
                    dateUTC: date.getTime(),
                    userCurrency: user.currency
                })
                : await createIncome({
                    paymentMethodId: paymentMethod.id, contactId: contact.id, sourceId: source.id,
                    amount: Math.round((+amount) * 100),
                    currency: currency.value,
                    dateUTC: date.getTime(),
                    userCurrency: user.currency
                });
            setLoading(false);
            toggle();
            refresh();
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const onChangeCurrency = (selectedOption) => {
        setCurrency(selectedOption);
        setIconAdditionalClasses(defineIconClasses(selectedOption.key));
    }

    return (
        <div className="ml-auto">
            {update
                ? <div className="mr-3 float-right">
                    <FontAwesomeIcon icon={['far', 'edit']}
                        className={"action-icon " + (user.id !== forUser.id ? "action-icon-disabled" : "")}
                        onClick={event => {
                            if (user.id !== forUser.id) {
                                return;
                            }
                            toggle(event);
                        }}
                        title="Edit record" />
                </div>
                : <button className="btn btn-primary main-button main-button-sm main-button-responsive"
                    disabled={user.id !== forUser.id}
                    onClick={event => {
                        if (user.id !== forUser.id) {
                            return;
                        }
                        toggle(event);
                    }}>
                    <div className="d-none d-md-block">
                        + Create Income
                    </div>
                    <div className="d-md-none">
                        + Income
                    </div>
                </button>
            }
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>
                    <b className="font-22 font-black">{
                        update ? "Edit Income" : "Create New Income"
                    }</b>
                </ModalHeader>
                <ModalBody>
                    <form className="form-row mt-1">
                        <div className="form-group col-12">
                            <label htmlFor="paymentMethod" className="control-label font-16 font-gray">
                                Payment Method
                            </label>
                            <Select
                                classNamePrefix="select"
                                value={paymentMethod}
                                isSearchable={true}
                                name="paymentMethod"
                                options={paymentMethods}
                                onChange={onSelectChangeHandler}
                            />
                            
                            <AddProperty property={"Payment Type"} collection={"paymentMethods"} updateProperty={updateProperty} />
                        </div>
                        <div className="form-group col-12">
                            <label htmlFor="contact" className="control-label font-16 font-gray">
                                Contact
                            </label>
                            <Select
                                classNamePrefix="select"
                                value={contact}
                                isSearchable={true}
                                name="contact"
                                options={contacts}
                                onChange={onSelectChangeHandler}
                            />
                            <AddProperty property={"Contact"} propertyData={contact} collection={"contacts"} updateProperty={updateProperty} />
                        </div>
                        <div className="form-group col-12">
                            <label htmlFor="source" className="control-label font-16 font-gray">
                                Source
                            </label>
                            <Select
                                classNamePrefix="select"
                                value={source}
                                isSearchable={true}
                                name="source"
                                options={sources}
                                onChange={onSelectChangeHandler}
                            />
                            <AddProperty property={"Source"} collection={"sources"} updateProperty={updateProperty} />
                        </div>

                        <div className="form-group col-12">
                            <label htmlFor="date" className="control-label font-16 font-gray">
                                Date
                            </label>
                            <InputGroup>
                                <DatePicker
                                    id="date"
                                    name="date"
                                    className="form-control"
                                    selected={date} onChange={date => setDate(date)} />
                                <InputGroupAddon addonType="append">
                                    <InputGroupText>
                                        <FontAwesomeIcon icon={['fas', 'calendar-alt']} style={{ color: "black" }} />
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            {dateError !== null && (
                                <div className="font-14 font-red mt-1">
                                    <span className="text-danger">{dateError}</span>
                                </div>
                            )}
                        </div>
                        <div className="form-group col-12">
                            <label htmlFor="currency" className="control-label font-16 font-gray">
                                Currency
                            </label>
                            <Select
                                options={currencyOptions}
                                defaultValue={currency}
                                isDisabled={currencyOptions.length < 2}
                                onChange={onChangeCurrency}
                            />
                        </div>
                        <div className="form-group col-12">
                            <label htmlFor="amount" className="control-label font-16 font-gray">
                                Amount
                            </label>
                            <InputGroup style={{ width: "230px" }}>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <div>{iconAdditionalClasses}</div>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input min={0} type="number" step="1"
                                    id="amount"
                                    name="amount"
                                    onChange={onChangeHandler}
                                    value={amount}>
                                </Input>
                            </InputGroup>
                            {amountError !== null && (
                                <div className="font-14 font-red mt-1">
                                    <span className="text-danger">{amountError}</span>
                                </div>
                            )}
                        </div>
                    </form>
                    <br />

                    <div className="float-right">
                        <Button color="default btn-sm" className="mr-2" onClick={toggle}>Cancel</Button>
                        <button className="btn btn-primary main-button main-button-sm" onClick={createNewIncome}>
                            Submit
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default WriteIncome;
