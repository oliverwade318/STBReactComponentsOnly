import React, { useState, useEffect } from 'react';
import { Button, Popover, PopoverBody, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import MultiSelect from "@khanacademy/react-multi-select";
import moment from "moment";

import './FilterIncomes.css';

const FilterIncomes = (props) => {
    const {
        forUser,
        parameters,
        filter
    } = props;

    const filterProperties = (options, search) => {
        return options.filter(
            next => !search || (!!next.label && next.label.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        );
    }
    const [popoverOpen, setPopoverOpen] = useState(false);
    const monthStart = new Date(moment().startOf('month').format());

    function toOptions(properties) {
        return properties.map(source => {
            return { label: source.name, value: source.id };
        });
    }

    const toggle = () => {
        setPopoverOpen(!popoverOpen)
    }

    useEffect(() => {
        setFrom(parameters.from || monthStart);
        setTo(parameters.to || new Date());
    }, [popoverOpen]);

    const clearFilters = () => {
        setPaymentMethods([]);
        setSources([]);
        setContacts([]);
        setFrom(monthStart);
        setTo(new Date());
        setDateError(null);
    }

    const [paymentMethods, setPaymentMethods] = useState([]);
    const [sources, setSources] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [from, setFrom] = useState(monthStart);
    const [to, setTo] = useState(new Date());
    const [dateError, setDateError] = useState(null);

    const doFilter = async (event) => {
        event.preventDefault();
        setDateError(null);
        if (!from || !to) {
            setDateError('Date range is required');
            return;
        }

        filter(from, to, paymentMethods, contacts, sources);
        toggle();
    };

    return (
        <div className="ml-auto">
            <div className="mr-3 float-right">
                <FontAwesomeIcon icon={['fas', 'sliders-h']} className="action-icon" onClick={toggle} id="filterPopover" />
            </div>
            <Popover placement="left" isOpen={popoverOpen} target="filterPopover" toggle={toggle} trigger="legacy">
                <PopoverBody className="mt-3">
                    <b className="font-22 font-black">Filtering</b>

                    <form className="form-row mt-3">
                        <div className="form-group col-12">
                            <label htmlFor="date" className="control-label font-16 font-gray">
                                Date range
                            </label>
                            <InputGroup>
                                <div className="date-picker">
                                    <DatePicker
                                        className="form-control datepicker-range"
                                        selected={from}
                                        onChange={date => setFrom(date)}
                                        selectsStart
                                        startDate={from}
                                        endDate={to} />
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>
                                            <FontAwesomeIcon icon={['fas', 'calendar-alt']} style={{ color: "black" }} />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </div>
                                <div className="date-label" style={{
                                    marginTop: "7px",
                                    marginLeft: "15px",
                                    marginRight: "15px",
                                }}>to</div>
                                <div className="date-picker">
                                    <DatePicker
                                        className="form-control datepicker-range"
                                        selected={to}
                                        onChange={date => setTo(date)}
                                        selectsEnd
                                        startDate={from}
                                        endDate={to}
                                        minDate={from} />
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>
                                            <FontAwesomeIcon icon={['fas', 'calendar-alt']} style={{ color: "black" }} />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </div>
                            </InputGroup>
                            {dateError !== null && (
                                <div className="font-14 font-red mt-1">
                                    <span className="text-danger">{dateError}</span>
                                </div>
                            )}
                        </div>

                        <div className="form-group col-12">
                            <label htmlFor="paymentMethod" className="control-label font-16 font-gray">
                                Payment Method
                            </label>
                            <MultiSelect
                                id="paymentMethod"
                                name="paymentMethod"
                                options={toOptions(forUser.paymentMethods)}
                                hasSelectAll={false}
                                disableSearch={forUser.paymentMethods.length <= 2}
                                filterOptions={filterProperties}
                                selected={paymentMethods}
                                onSelectedChanged={paymentMethods => setPaymentMethods(paymentMethods)} />
                        </div>
                        <div className="form-group col-12">
                            <label htmlFor="contact" className="control-label font-16 font-gray">
                                Contact
                            </label>
                            <MultiSelect
                                id="contact"
                                name="contact"
                                options={toOptions(forUser.contacts)}
                                hasSelectAll={false}
                                disableSearch={forUser.contacts.length <= 2}
                                filterOptions={filterProperties}
                                selected={contacts}
                                onSelectedChanged={contacts => setContacts(contacts)} />
                        </div>
                        <div className="form-group col-12">
                            <label htmlFor="source" className="control-label font-16 font-gray">
                                Source
                            </label>
                            <MultiSelect
                                id="source"
                                name="source"
                                options={toOptions(forUser.sources)}
                                hasSelectAll={false}
                                disableSearch={forUser.sources.length <= 2}
                                filterOptions={filterProperties}
                                selected={sources}
                                onSelectedChanged={sources => setSources(sources)} />
                        </div>
                    </form>

                    <div className="float-right mb-3">
                        <Button color="default btn-sm" className="mr-2" onClick={clearFilters}>Clear</Button>
                        <button className="btn btn-primary main-button main-button-sm" onClick={doFilter}>
                            Apply
                        </button>
                    </div>

                </PopoverBody>
            </Popover>
        </div >
    );
}

export default FilterIncomes;
