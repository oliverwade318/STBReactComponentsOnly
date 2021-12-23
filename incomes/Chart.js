import React, { useContext, useState, useEffect } from "react";
import { Chart } from '@marme1ad/react-charts-fill'
import { UserContext } from "../../providers/UserProvider";
import CONSTANTS from "../../shared/Constants";
import './Chart.css';

const defs = (
    <defs>
        <linearGradient id="0" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="#FFAEBF" />
            <stop offset="100%" stopColor="#B783FF" />
        </linearGradient>
        <linearGradient id="fill0" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFAEBF" />
            <stop offset="90%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="1" x1="0" x2="0" y1="1" y2="0">
            {/* background: linear-gradient(41.02deg, #FF9C51 0%, #FFD46C 100%); */}
            <stop offset="0%" stopColor="#FF9C51" />
            <stop offset="100%" stopColor="#FFD46C" />
        </linearGradient>
        <linearGradient id="fill1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FF9C51" />
            <stop offset="90%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="2" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="#42E695" />
            <stop offset="100%" stopColor="#3BB2B8" />
        </linearGradient>
        <linearGradient id="fill2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#42E695" />
            <stop offset="90%" stopColor="#FFFFFF" />
        </linearGradient>

        <linearGradient id="3" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="#7ab4f3" />
            <stop offset="100%" stopColor="#007bff" />
        </linearGradient>
        <linearGradient id="fill3" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7ab4f3" />
            <stop offset="90%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="4" x1="0" x2="0" y1="1" y2="0">
            {/* background: linear-gradient(41.02deg, #FF9C51 0%, #FFD46C 100%); */}
            <stop offset="0%" stopColor="#f3828d" />
            <stop offset="100%" stopColor="#dc3545" />
        </linearGradient>
        <linearGradient id="fill4" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f3828d" />
            <stop offset="90%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="5" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="#f5db8c" />
            <stop offset="100%" stopColor="#ffc107" />
        </linearGradient>
        <linearGradient id="fill5" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f5db8c" />
            <stop offset="90%" stopColor="#FFFFFF" />
        </linearGradient>
        <linearGradient id="6" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="#8de1ef" />
            <stop offset="100%" stopColor="#17a2b8" />
        </linearGradient>
        <linearGradient id="fill6" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8de1ef" />
            <stop offset="90%" stopColor="#FFFFFF" />
        </linearGradient>
    </defs>
)

const ChartTypeEnum = Object.freeze({ TOTAL: 0, WEEK: 1, MONTH: 2, YEAR: 3 });
const chartType = ['Total', 'Week', 'Month', 'Year'];
const TheChart = (props) => {
    const { user, asUser } = useContext(UserContext);

    const [symbol, setSymbol] = useState("");
    useEffect(() => {
        const theKey = asUser?.currency || user.currency || CONSTANTS.defaultCurrency.key
        const theCurrency = CONSTANTS.currencies.find(next => next.key === theKey) || CONSTANTS.defaultCurrency;
        setSymbol(theCurrency.symbol);
    }, [user]);

    const {
        chartData,
        to,
        chartLabels
    } = props;

    const [type, setType] = useState(ChartTypeEnum.MONTH);

    const defineLines = () => {
        let data;
        switch (type) {
            case ChartTypeEnum.TOTAL:
                data = chartData?.total?.lines || [];
                break;
            case ChartTypeEnum.WEEK:
                data = chartData?.week?.lines || [];
                break;
            case ChartTypeEnum.YEAR:
                data = chartData?.year?.lines || [];
                break;
            default:
                const tempData = Object.assign([], chartData?.month?.lines || []);
                if (chartLabels.length > 0)
                tempData.map(item => {
                    item.data = item.data.filter(dataItem => dataItem[0] === '1' || dataItem[0] === to.toString() || chartLabels.includes(dataItem[0]));
                    return item;
                });
                data = tempData;
                break;
        }
        return data;
    }
    
    let data = defineLines();
    useEffect(() => {
        data = defineLines();
    }, [type, chartData]);

    const tooltip = React.useMemo(
        () => ({
            align: "top",
            render: ({ getStyle, secondaryAxis, datum }) => {
                return <SimpleTooltip {...{ getStyle, secondaryAxis, datum }} />
            }
        }),
        []
    )

    const axes = React.useMemo(
        () => [
            { primary: true, type: 'ordinal', position: 'bottom', show: true },
            {
                type: 'linear', position: 'left', format: value => {
                    const numeric = value.replace(/[^0-9.]/g, '');
                    return `${symbol}${numeric / 100.0}`
                }, hardMin: 0, show: true
            }
        ],
        [symbol]
    )

    const [{ activeSeriesIndex, activeDatumIndex }, setSeriesState] = React.useState({
        activeSeriesIndex: -1,
        activeDatumIndex: -1
    })

    const getSeriesStyle = React.useCallback(
        series => ({
            showShadow: true,
            color: `url(#${series.index % 7})`,
            fill: `url(#fill${series.index % 7})`,
            opacity:
                activeSeriesIndex > -1
                    ? series.index === activeSeriesIndex
                        ? 1
                        : 0.3
                    : 1,
            fillOpacity:
                activeSeriesIndex > -1
                    ? series.index === activeSeriesIndex
                        ? 0.7
                        : 0.3
                    : 0.7,
        }),
        [activeSeriesIndex]
    )
    const getDatumStyle = React.useCallback(
        datum => {
            const value = datum.originalSeries.data[datum.index][1];
            if (value === 0) {
                return {
                    r: 0
                };
            }
            return {
                r:
                    activeDatumIndex === datum.index &&
                        activeSeriesIndex === datum.seriesIndex
                        ? 7
                        : activeDatumIndex === datum.index
                            ? 5
                            : datum.series.index === activeSeriesIndex
                                ? 3
                                : datum.otherHovered
                                    ? 2
                                    : 2

            }
        },
        [activeDatumIndex, activeSeriesIndex]
    )

    const onFocus = React.useCallback(
        focused =>
            setSeriesState({
                activeSeriesIndex: focused ? focused.series.id : -1,
                activeDatumIndex: focused ? focused.index : -1
            }),
        [setSeriesState]
    )

    let year = true;

    return (
        <div className="card app-chart-container app-responsive-container">
            <div className="card-body">
                <div className="row mx-2 mb-4">
                    <b className="font-22 font-black mr-4">Financial Reports</b>
                    <div className="ml-auto float-right">
                        <a className={"app-chart-link font-14 ml-2 font-gray " + (type === ChartTypeEnum.TOTAL
                            ? "app-chart-link-active" : "")}
                            onClick={(event) => setType(ChartTypeEnum.TOTAL)}>
                            TOTAL
                        </a>
                        <a className={"app-chart-link font-14 ml-2 font-gray " + (type === ChartTypeEnum.WEEK
                            ? "app-chart-link-active" : "")}
                            onClick={(event) => setType(ChartTypeEnum.WEEK)}>
                            WEEK
                        </a>
                        <a className={"app-chart-link font-14 ml-2 font-gray " + (type === ChartTypeEnum.MONTH
                            ? "app-chart-link-active" : "")}
                            onClick={(event) => setType(ChartTypeEnum.MONTH)}>
                            MONTH
                        </a>
                        <a className={"app-chart-link font-14 ml-2 font-gray " + (type === ChartTypeEnum.YEAR
                            ? "app-chart-link-active" : "")}
                            onClick={(event) => setType(ChartTypeEnum.YEAR)}>
                            YEAR
                        </a>
                    </div>
                </div>

                <div className="row mx-2 mb-1 mt-n2 justify-content-center">
                    {
                        !!data && data.length > 1
                            ? <div className="d-inline-block">
                                {data.map((line, index) => <SourceLabel label={line.label} urlId={index} key={index} />)}
                            </div>
                            : ""
                    }
                </div>

                <div className={"row mx-2 chartWrapper " + (!!data && data.length > 1 ? "app-chart-short" : "app-chart")}>
                    {
                        !!data && data.length > 0
                            ? <Chart className="app-custom-chart" data={data} axes={axes}
                                tooltip={tooltip}
                                getSeriesStyle={getSeriesStyle}
                                getDatumStyle={getDatumStyle}
                                onFocus={onFocus}
                                primaryCursor={{
                                    showLine: false
                                }}
                                renderSVG={() => defs}
                            />
                            : <div>{`Please enter your income for this ${chartType[type]}`}</div>
                    }
                </div>
            </div>
        </div >
    )
}

export default TheChart;

const SourceLabel = (props) => {
    const {
        urlId,
        label
    } = props;
    
    return (
        <div className="d-inline-block" style={{
            marginRight: "25px"
        }}>
            <svg width="16" height="16" style={{
                marginTop: "-3px",
                marginRight: "3px"
            }}>
                <circle cx="8" cy="8" r="7" style={{
                    r: "7px",
                    stroke: "white",
                    fill: `url(#${urlId})`,
                    strokeWidth: "1"
                }}>
                </circle>
            </svg>
            <span className="font-14 font-black">{label}</span>
        </div >
    );
}

function SimpleTooltip({ getStyle, secondaryAxis, datum }) {
    const data = React.useMemo(
        () => {
            return datum
                ? {
                    data: datum.group.map((theData, i) => ({
                        index: i,
                        amount: theData.secondary,
                        label: theData.seriesLabel
                    })),
                    focused: datum.seriesID
                }
                : {}
        },
        [datum, getStyle]
    )

    return datum ? (
        data.data.length > 1
            ? <table className="custom-chart-tooltip">
                <tbody>
                    {data.data.map((entry, index) =>
                        <tr key={index} style={{
                            opacity: index === data.focused ? 1 : 0.5
                        }}>
                            <td>
                                <svg width="16" height="16" style={{
                                    marginTop: "1px"
                                }}>
                                    <circle cx="8" cy="8" r="7" style={{
                                        r: "7px",
                                        stroke: "white",
                                        fill: `url(#${index})`,
                                        strokeWidth: "1"
                                    }}>
                                    </circle>
                                </svg>
                            </td>
                            <td>
                                {entry.label}
                            </td>
                            <td style={{
                                textAlign: "right"
                            }}>
                                {secondaryAxis.format(entry.amount)}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            : <div style={{
                color: 'white',
                fontSize: "12px",
                fontWeight: 700,
                pointerEvents: 'none',
                minWidth: "35px"
            }}>
                <span style={{
                    display: 'block',
                    textAlign: 'center'
                }}>
                    {secondaryAxis.format(datum.secondary)}
                </span>
            </div >
    ) : null
}
