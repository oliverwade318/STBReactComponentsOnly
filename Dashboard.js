import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import StatisticCard from '../shared/StatisticCard';
import {
    formatDate, dayEndUTC, minusDay, previousWeekEnd, previousMonthEnd, previousYearEnd
} from '../shared/DateUtils';
import SortTable from '../shared/SortTable';
import { getIncomesResult } from "../api/rest";
import { CurrencyHandler, PropertyHandler, DateRange } from "../shared/HelperHandlers";
import RemoveIncome from "./incomes/RemoveIncome";
import WriteIncome from "./incomes/WriteIncome";
import FilterIncomes from "./incomes/FilterIncomes";
import ExportIncomes from "./incomes/ExportIncomes";
import TheChart from "./incomes/Chart";
import { Table, InputGroup } from 'reactstrap';
import ReactPaginate from 'react-paginate';
import TabularData from './TabularData';
import './Dashboard.css';


const Dashboard = () => {
    // const navigate = useNavigate();
    const { user, asUser, propertyMaps, asUserPropertyMaps, setLoading } = useContext(UserContext);
    // useEffect(() => {
    //     const subscriptionDiff = user.subscription ? user.subscription - Date.now() : -1;
    //     if (!user.isAdmin && subscriptionDiff < 0) {
    //         navigate('/subscription');
    //     }
    // }, []);

    const [theUser, setTheUser] = useState(!!asUser ? asUser : user);
    const [thePropertyMaps, setThePropertyMaps] = useState(!!asUser ? asUserPropertyMaps : propertyMaps);
    useEffect(() => {
        setTheUser(!!asUser ? asUser : user);
        setThePropertyMaps(!!asUser ? asUserPropertyMaps : propertyMaps);
    }, [user, asUser, propertyMaps, asUserPropertyMaps]);

    const [sortProperty, setSortProperty] = useState("dateUTC");
    const [sortAscending, setSortAscending] = useState(true);
    function doSort(property) {
        const propertySelected = property !== sortProperty;
        setSortProperty(property);
        setSortAscending(propertySelected || !sortAscending);
    }

    const comparisonFunctions = {
        "dateUTC": function (a, b) {
            return a.dateUTC - b.dateUTC;
        },
        "amount": function (a, b) {
            return a.amount - b.amount;
        },
        "paymentMethodId": function (a, b) {
            let paymentMethodA = thePropertyMaps.paymentMethods[a.paymentMethodId];
            let paymentMethodB = thePropertyMaps.paymentMethods[b.paymentMethodId];
            if (paymentMethodA > paymentMethodB) {
                return 1;
            }
            if (paymentMethodA < paymentMethodB) {
                return -1;
            }
            return 0;
        },
        "sourceId": function (a, b) {
            let sourceA = thePropertyMaps.sources[a.sourceId];
            let sourceB = thePropertyMaps.sources[b.sourceId];
            if (sourceA > sourceB) {
                return 1;
            }
            if (sourceA < sourceB) {
                return -1;
            }
            return 0;
        },
        "contactId": function (a, b) {
            let contactA = thePropertyMaps.contacts[a.contactId];
            let contactB = thePropertyMaps.contacts[b.contactId];
            if (contactA > contactB) {
                return 1;
            }
            if (contactA < contactB) {
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
        setIncomes(records.slice().sort(functionToUse));
    }
    useEffect(() => {
        sortRecords(incomes);
    }, [sortProperty, sortAscending]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    function paginate(changeState) {
        const maxPage = incomes.length === 0 ? 1 : (Math.floor((incomes.length - 1) / pageSize) + 1);
        const thePage = Math.min(page, maxPage);
        if (changeState) {
            setPage(Math.min(page, maxPage));
        }
        const begin = (thePage - 1) * pageSize;
        const end = thePage * pageSize;
        setDisplayedIncomes(incomes.slice(begin, end));
    }

    const [incomesResult, setIncomesResult] = useState({
        total: null,
        subtotal: null
    });
    const [incomes, setIncomes] = useState([]);
    const [displayedIncomes, setDisplayedIncomes] = useState([]);
    const [statistics, setStatistics] = useState({
        today: null,
        currentWeek: null,
        currentMonth: null,
        currentYear: null
    });
    const [chartData, setChartData] = useState({
        week: null,
        month: null,
        year: null,
        total: null
    });
    const [chartLabels, setChartLabels] = useState([]);
    const [loaded, setLoaded] = useState(Date.now());
    function reload() {
        setLoaded(Date.now());
    }

    const [filterParameters, setFilterParameters] = useState({
        from: new Date(`1/1/${new Date().getFullYear()}`),
        to: new Date(),
        paymentMethods: [],
        sources: Object.keys(thePropertyMaps.sources),
        contacts: []
    });
    
    function filterOut(from, to, paymentMethods, contacts, sources) {
        setFilterParameters({
            from: from,
            to: to,
            paymentMethods: paymentMethods,
            contacts: contacts,
            sources: sources
        });
        reload();
    }

    const PeriodEnum = Object.freeze({ YESTERDAY: 0, PREVIOUS_WEEK: 1, PREVIOUS_MONTH: 2, PREVIOUS_YEAR: 3 });

    function goBack(period) {
        if (!filterParameters.to) {
            return;
        }

        const currentTo = filterParameters.to.getTime();
        let [from, to] = [];
        switch (period) {
            case PeriodEnum.YESTERDAY:
                const dayEnd = dayEndUTC(currentTo);
                to = minusDay(dayEnd);
                from = minusDay(to) + 1;
                break;
            case PeriodEnum.PREVIOUS_WEEK:
                to = previousWeekEnd(currentTo);
                from = previousWeekEnd(to) + 1;
                break;
            case PeriodEnum.PREVIOUS_MONTH:
                to = previousMonthEnd(currentTo);
                from = previousMonthEnd(to) + 1;
                break;
            default: // PeriodEnum.PREVIOUS_YEAR
                to = previousYearEnd(currentTo);
                from = previousYearEnd(to) + 1;
                break;
        }

        filterOut(new Date(from), new Date(to),
            filterParameters.paymentMethods, filterParameters.contacts, filterParameters.sources);
    }

    useEffect(() => {
        const sortIncomes = Object.assign([], incomes);
        sortIncomes.sort((a, b) => (a.dateUTC > b.dateUTC) ? 1 : -1);
        if (sortIncomes.length > 0) {
            setFilterParameters((prev) => ({...prev, from: new Date(sortIncomes[0].dateUTC), to: new Date()}))
        }
    }, [incomes]);

    useEffect(() => {
        sortRecords(incomes);
    }, [sortProperty, sortAscending]);

    useEffect(() => {
        paginate(true);
    }, [pageSize, incomes]);
    useEffect(() => {
        paginate(false);
    }, [page]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            let incomesResult = await getIncomesResult(
                filterParameters.from.getTime(),
                filterParameters.to.getTime(),
                filterParameters.paymentMethods,
                filterParameters.contacts,
                filterParameters.sources
            );
            setLoading(false);
            const tempLabels = [];
            if (incomesResult.chartData && incomesResult.chartData.month)
                for (const item of incomesResult.chartData.month.lines) {
                    for (const itemData of item.data) {
                        if (!tempLabels.includes(itemData[0]) && itemData[1] !== 0) tempLabels.push(itemData[0]);
                    }
                }
            setIncomesResult(incomesResult);
            setStatistics(incomesResult.statistics);
            setChartData(incomesResult.chartData);
            setChartLabels(tempLabels);
            sortRecords(incomesResult.results);
        }
        fetchData();
    }, [loaded]);

    return (
        <>
            <div className="row mx-3 my-3 pt-3 pb-2 dasboard-header">
                <b className="font-36 font-black app-responsive-header">Dashboard</b>

                <WriteIncome forUser={theUser} update={false} refresh={reload} className="modal-margin" />
            </div>

            <div className="row px-2">
                <div className="col-lg-9 col-order-2">
                    <TheChart chartData={chartData} to={new Date(filterParameters.to).getDate()} chartLabels={chartLabels} />
                </div>
                <div className="col-lg-3 col-order-1">
                    <StatisticCard label="Today" statisticData={statistics.today} title="Go yesterday"
                        callback={goBack.bind(this)} period={PeriodEnum.YESTERDAY} />
                    <StatisticCard label="This week" statisticData={statistics.currentWeek} title="Go previous week"
                        callback={goBack.bind(this)} period={PeriodEnum.PREVIOUS_WEEK} />
                    <StatisticCard label="This month" statisticData={statistics.currentMonth} title="Go previous month"
                        callback={goBack.bind(this)} period={PeriodEnum.PREVIOUS_MONTH} />
                    <StatisticCard label="This year" statisticData={statistics.currentYear} title="Go previous year"
                        callback={goBack.bind(this)} period={PeriodEnum.PREVIOUS_YEAR} />
                    <StatisticCard label="TOTAL" statisticData={{
                        sum: incomesResult?.total
                    }} total />
                </div>
            </div>

            <div className="row px-2">
                <div className="col-12">
                    <div className="card my-4 app-responsive-container">
                        <div className="card-body income-history-card">
                            <div className="row mx-2 mt-2">
                                <b className="font-22 font-black mr-4">Income History</b>
                                <b className={
                                    "font-16 font-black pt-1 d-none d-md-block" +
                                    (!!incomesResult.subtotal || incomesResult.subtotal === 0 ? "" : "d-none")
                                }>
                                    Subtotal: <CurrencyHandler amount={incomesResult.subtotal} />
                                    <DateRange from={filterParameters?.from} to={filterParameters?.to} />
                                </b>

                                <FilterIncomes forUser={theUser} parameters={filterParameters} incomes={displayedIncomes} filter={filterOut.bind(this)} />
                                <ExportIncomes />
                            </div>

                            <div className="row mx-2 mt-4 table-row">
                                <div className="d-md-none w-100">
                                    { displayedIncomes.length === 0 ? 
                                        <p className="no-item text-center">No items</p> 
                                        : displayedIncomes.map(function (income, i) {
                                            const props = {income: income, reload: reload, theUser: theUser};
                                            i % 2 == 0 ? props.is_Odd = false : props.is_Odd = true;

                                            return (<TabularData income={income} reload={reload} theUser={theUser}
                                                is_Odd={i % 2 == 0 ? false : true} key={i} /> )
                                        }) 

                                    }
                                </div>
                                <Table hover responsive className="d-mid-block">
                                    <thead>
                                        <tr className="d-flex">
                                            <th className="font-16 font-gray col-2">
                                                <div className="float-left">DATE</div>
                                                <SortTable property={"dateUTC"} currentProperty={sortProperty} ascending={sortAscending} doSort={doSort.bind(this)} />
                                            </th>
                                            <th className="font-16 font-gray col-2">
                                                <div className="float-left">CONTACT</div>
                                                <SortTable property={"contactId"} currentProperty={sortProperty} ascending={sortAscending} doSort={doSort.bind(this)} />
                                            </th>
                                            <th className="font-16 font-gray col-2">
                                                <div className="float-left">AMOUNT</div>
                                                <SortTable property={"amount"} currentProperty={sortProperty} ascending={sortAscending} doSort={doSort.bind(this)} />
                                            </th>
                                            <th className="font-16 font-gray col-2">
                                                <div className="float-left">PAYMENT METHOD</div>
                                                <SortTable property={"paymentMethodId"} currentProperty={sortProperty} ascending={sortAscending} doSort={doSort.bind(this)} />
                                            </th>
                                            <th className="font-16 font-gray col-2">
                                                <div className="float-left">SOURCE</div>
                                                <SortTable property={"sourceId"} currentProperty={sortProperty} ascending={sortAscending} doSort={doSort.bind(this)} />
                                            </th>
                                            <th className="col-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedIncomes.length === 0
                                            ? <tr>
                                                <td colSpan="6" className="text-center">No items</td>
                                            </tr>
                                            : displayedIncomes.map(function (income, i) {
                                                return <tr className="d-flex" key={i}>
                                                    <td className="font-16 font-black col-2">
                                                        {formatDate(income.dateUTC)}
                                                    </td>
                                                    <td className="font-16 font-black col-2">
                                                        <PropertyHandler propertyId={income.contactId} collection={theUser.contacts} />
                                                    </td>
                                                    <td className="font-16 font-black col-2">
                                                        <CurrencyHandler amount={income.originAmount} currency={income.currency} />
                                                    </td>
                                                    <td className="font-16 font-black col-2">
                                                        <PropertyHandler propertyId={income.paymentMethodId} collection={theUser.paymentMethods} />
                                                    </td>
                                                    <td className="font-16 font-black col-2">
                                                        <PropertyHandler propertyId={income.sourceId} collection={theUser.sources} />
                                                    </td>
                                                    <td className="col-2">
                                                        <RemoveIncome forUser={theUser} income={income} refresh={reload} />
                                                        <WriteIncome forUser={theUser} income={income} update={true} refresh={reload} className="modal-margin" />
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <div className="d-flex align-items-center paginationWrapper">
                                    <div className="d-flex">
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
                                            }}>Records
                                        </div>
                                    </div>
                                    <div className="footer-part d-inline-block">
                                        <ReactPaginate
                                            previousLabel={'<'}
                                            nextLabel={'>'}
                                            breakLabel={'...'}
                                            pageCount={incomes.length === 0 ? 1 : (Math.floor((incomes.length - 1) / pageSize) + 1)}
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Dashboard;
