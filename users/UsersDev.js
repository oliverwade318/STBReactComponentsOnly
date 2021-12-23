import React, { useEffect, useState, useContext } from "react";
import store from "store";
import { useNavigate } from "@reach/router";
import { UserContext } from "../../providers/UserProvider";
import { Table, InputGroup, InputGroupAddon, InputGroupText, Row, Col } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import { formatDate } from '../../shared/DateUtils';
import SortTable from '../../shared/SortTable';
import { getUsers, updateUserData, getIncomes } from "../../api/rest";
import ExportUsers from "./ExportUsers";
import moment from 'moment';
import UserData from "../UserData";
import CONSTANTS from "../../shared/Constants";
import "./Users.css";

const ChartTypeEnum = Object.freeze({ TOTAL: 0, WEEK: 1, MONTH: 2, YEAR: 3 });
const UsersDev = () => {
    const navigate = useNavigate()
    const { setAsUser, user } = useContext(UserContext);
    const [sortProperty, setSortProperty] = useState("registered");
    const [sortAscending, setSortAscending] = useState(true);
    const [filterParameters, setFilterParameters] = useState({
        from: new Date(`1/1/${new Date().getFullYear()}`),
        to: new Date()
    });
    const [users, setUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [loaded, setLoaded] = useState(Date.now());
    const [incomes, setIncomes] = useState({});
    const [type, setType] = useState(ChartTypeEnum.YEAR);
    const [from, setFrom] = useState(new Date(`1/1/${new Date().getFullYear()}`));
    const [to, setTo] = useState(new Date());

    const treatIncomes = (incomesArray, usersArray = users) => {
        const tempIncomes = {};
        for (const income of incomesArray) {
            const sourceId = income.sourceId;
            const user = usersArray.find(index => index.id === income.userId);
            if (!user) continue;
            const source = user.sources.find(index => index.id === sourceId);
            if (!tempIncomes[source.name]) tempIncomes[source.name] = 0;
            tempIncomes[source.name] += income.amount;
        }
        setIncomes(tempIncomes);
    }
    useEffect(() => {
        async function fetchData() {
            const incomesResult = await getIncomes(
                filterParameters.from.getTime(),
                filterParameters.to.getTime()
            );
            treatIncomes(incomesResult);
        }
        if (users.length> 0)  fetchData();
    }, [filterParameters]);

    function doSort(property) {
        const propertySelected = property !== sortProperty;
        setSortProperty(property);
        setSortAscending(propertySelected || !sortAscending);
    }

    const comparisonFunctions = {
        "registered": function (a, b) {
            return a.registered - b.registered;
        },
        "total": function (a, b) {
            return a.total - b.total;
        },
        "username": function (a, b) {
            let usernameA = a.username;
            let usernameB = b.username;
            if (usernameA > usernameB) {
                return 1;
            }
            if (usernameA < usernameB) {
                return -1;
            }
            return 0;
        },
        "email": function (a, b) {
            let emailA = a.email;
            let emailB = b.email;
            if (emailA > emailB) {
                return 1;
            }
            if (emailA < emailB) {
                return -1;
            }
            return 0;
        }
    }

    function sortRecords(records) {
        const sortFunction = comparisonFunctions[sortProperty];
        const functionToUse = !sortAscending ? sortFunction : function (a, b) {
            return - sortFunction(a, b);
        }
        setUsers(records.slice().sort(functionToUse));
    }

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    function paginate(changeState) {
        const maxPage = users.length === 0 ? 1 : (Math.floor((users.length - 1) / pageSize) + 1);
        const thePage = Math.min(page, maxPage);
        if (changeState) {
            setPage(Math.min(page, maxPage));
        }
        const begin = (thePage - 1) * pageSize;
        const end = thePage * pageSize;
        setDisplayedUsers(users.slice(begin, end));
    }
    
    function reload() {
        setLoaded(Date.now());
    }

    useEffect(() => {
        sortRecords(users);
    }, [sortProperty, sortAscending]);

    useEffect(() => {
        paginate(true);
    }, [pageSize, users]);
    
    useEffect(() => {
        paginate(false);
    }, [page]);

    useEffect(() => {
        let fromDate = '';
        switch (type) {
            case ChartTypeEnum.TOTAL:
                fromDate = new Date('1990-1-1');
                break;
            case ChartTypeEnum.WEEK:
                fromDate = moment(filterParameters.to).startOf('isoWeek');
                break;
            case ChartTypeEnum.YEAR:
                fromDate = moment(filterParameters.to).startOf('year');
                break;
            default:
                fromDate = moment(filterParameters.to).startOf('month');
                break;
        }
        setFilterParameters((prev) => ({...prev, from: new Date(fromDate)}));
    }, [type]);

    useEffect(() => {
        async function fetchUsers() {
            let users = await getUsers();
            const incomesResult = await getIncomes(
                filterParameters.from.getTime(),
                filterParameters.to.getTime()
            );
            sortRecords(users);
            treatIncomes(incomesResult, users);
        }
        fetchUsers();
    }, [loaded]);

    const showFor = (user) => {
        store.set(CONSTANTS.AS_USER, user.id);
        setAsUser(user);
        navigate('/dashboard');
    }

    const onChangeTrial = async (user, value) => {
        console.log(user, value);
        const nextSubscription = moment(user.subscription).add(value, 'days').format();
        const subscription = new Date(nextSubscription).getTime();
        const body = {
            id: user.id,
            addedTrial: value,
            subscription
        };
        const updatedUser = await updateUserData(body);
        reload();
        // const tempUsers = Object.assign([], users);
        // tempUsers.map(item => {
        //     if (item.id === updatedUser.id) return updatedUser;
        //     return item;
        // });
        // sortRecords(tempUsers);
        // console.log(updatedUser);
    }

    return (
        <>
            <div className="row mx-3 my-3 pt-3 pb-2">
                <Row className="userTotalWrapper">
                    <Col className="sourcesWrapper" xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            Object.keys(incomes).map(key => (
                                <span key={key} className="userSource">
                                    {
                                        `${key} $${Math.round(incomes[key] * 100) / 100}`
                                    }
                                </span>
                            ))
                        }
                    </Col>
                    <div className="float-right typeWrapper">
                        <a className={"app-chart-link font-14 ml-2 font-gray " + (type === ChartTypeEnum.TOTAL
                            ? "app-chart-link-active" : "")}
                            onClick={() => setType(ChartTypeEnum.TOTAL)}>
                            TOTAL
                        </a>
                        <a className={"app-chart-link font-14 ml-2 font-gray " + (type === ChartTypeEnum.WEEK
                            ? "app-chart-link-active" : "")}
                            onClick={() => setType(ChartTypeEnum.WEEK)}>
                            WEEK
                        </a>
                        <a className={"app-chart-link font-14 ml-2 font-gray " + (type === ChartTypeEnum.MONTH
                            ? "app-chart-link-active" : "")}
                            onClick={() => setType(ChartTypeEnum.MONTH)}>
                            MONTH
                        </a>
                        <a className={"app-chart-link font-14 ml-2 font-gray " + (type === ChartTypeEnum.YEAR
                            ? "app-chart-link-active" : "")}
                            onClick={() => setType(ChartTypeEnum.YEAR)}>
                            YEAR
                        </a>
                    </div>
                    <div className="dateWrapper">
                        <InputGroup>
                            <div className="date-picker">
                                <DatePicker
                                    className="form-control datepicker-range"
                                    selected={from}
                                    onChange={date => {
                                        setFilterParameters((prev) => ({...prev, from: date}));
                                        setFrom(date);
                                    }}
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
                                marginLeft: "10px",
                                marginRight: "10px",
                            }}>to</div>
                            <div className="date-picker">
                                <DatePicker
                                    className="form-control datepicker-range"
                                    selected={to}
                                    onChange={date => {
                                        setFilterParameters((prev) => ({...prev, to: date}));
                                        setTo(date);
                                    }}
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
                    </div>
                </Row>
                {/* TODO: Replace Dashboard with Users in NavigationBar */}
            </div>

            <div className="row px-3" >
                <div className="col-12">
                    <div className="card my-4 app-responsive-container users-container-fix">
                        <div className="card-body">
                            <div className="row mx-2 mt-2">
                                <b className="font-22 font-black mr-4">All Users</b>
                                <ExportUsers />

                                {/* <div className="float-right">
                                    <input
                                        id="filter"
                                        name="filter"
                                        placeholder="Search..."
                                        className="form-control"
                                        style={{ width: "120px" }}
                                        onChange={event => setPageSize(event.currentTarget.value)}
                                        value={pageSize} />
                                </div> */}
                            </div>

                            <div className="d-md-none w-100 mt-4">
                                {displayedUsers.length === 0
                                    ? <p className="no-item text-center">No items</p> 
                                    : displayedUsers.map(function (user, i) {
                                        return <UserData user={user} key={i} />
                                    })
                                }
                            </div>

                            <div className="row mx-2 mt-4">
                                <Table hover responsive className="d-mid-block">
                                    <thead>
                                        <tr className="d-flex">
                                            <th className="font-16 font-gray col-3">
                                                <div className="float-left">USERNAME</div>
                                                <SortTable property={"username"} currentProperty={sortProperty} ascending={sortAscending} doSort={doSort.bind(this)} />
                                            </th>
                                            <th className="font-16 font-gray col-3">
                                                <div className="float-left">EMAIL</div>
                                                <SortTable property={"email"} currentProperty={sortProperty} ascending={sortAscending} doSort={doSort.bind(this)} />
                                            </th>
                                            <th className="font-16 font-gray col-3">
                                                <div className="float-left">REGISTERED</div>
                                                <SortTable property={"registered"} currentProperty={sortProperty} ascending={sortAscending} doSort={doSort.bind(this)} />
                                            </th>
                                            <th className="font-16 font-gray col-2">
                                                <div className="float-left">ADD TRIAL</div>
                                            </th>
                                            <th className="col-1"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedUsers.length === 0
                                            ? <tr>
                                                <td colSpan="5" className="text-center">No items</td>
                                            </tr>
                                            : displayedUsers.map(function (item, i) {
                                                return <tr className="d-flex" key={i}>
                                                    <td className="font-16 font-black col-3">
                                                        {item.username}
                                                    </td>
                                                    <td className="font-16 font-black col-3">
                                                        {item.email}
                                                    </td>
                                                    <td className="font-16 font-black col-3">
                                                        {formatDate(item.registered)}
                                                    </td>
                                                    <td className="col-2">
                                                        <select
                                                            className="form-control-sm"
                                                            name="trial"
                                                            value={item.addedTrial}
                                                            disabled={item.addedTrial}
                                                            onChange={(event) => onChangeTrial(item, event.currentTarget.value)}
                                                        >
                                                            <option value={0}></option>
                                                            <option value={14}>14</option>
                                                            <option value={30}>30</option>
                                                        </select>
                                                    </td>
                                                    <td className="col-1">
                                                        {(!item.isAdmin || item.id === user.id)
                                                            ? <div className="ml-auto mr-3 float-right">
                                                                <FontAwesomeIcon icon={['fas', 'eye']} className="action-icon" onClick={event => showFor(item)} title="Show data" />
                                                            </div>
                                                            : null
                                                        }
                                                        {/* <RemoveIncome income={income} refresh={reload} />
                                                        <WriteIncome forUser={user} income={income} update={true} refresh={reload} /> */}
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="5">
                                                <div className="footer-part float-left">
                                                    <InputGroup>
                                                        <select
                                                            id="pageSize"
                                                            name="pageSize"
                                                            className="form-control-sm"
                                                            style={{ width: "60px" }}
                                                            onChange={event => setPageSize(event.currentTarget.value)}
                                                            value={pageSize}>
                                                            <option key={10} value={10}>10</option>
                                                            <option key={25} value={25}>25</option>
                                                            <option key={50} value={50}>50</option>
                                                        </select>
                                                        <div className="font-12 font-gray"
                                                            style={{
                                                                marginTop: "9px",
                                                                marginLeft: "10px",
                                                            }}>Records</div>
                                                    </InputGroup>
                                                </div>
                                                <div className="footer-part d-inline-block">
                                                    <ReactPaginate
                                                        previousLabel={'<'}
                                                        nextLabel={'>'}
                                                        breakLabel={'...'}
                                                        pageCount={users.length === 0 ? 1 : (Math.floor((users.length - 1) / pageSize) + 1)}
                                                        marginPagesDisplayed={1}
                                                        pageRangeDisplayed={3}
                                                        disableInitialCallback={true}
                                                        onPageChange={event => setPage(event.selected + 1)}
                                                        containerClassName={'pagination float-right'}
                                                        pageClassName={'app-link mr-1'}
                                                        previousClassName={'app-link mr-1'}
                                                        nextClassName={'app-link mr-1'}
                                                        breakClassName={'app-link mr-1'}
                                                        activeClassName={'app-link font-weight-bold'} />
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default UsersDev;
