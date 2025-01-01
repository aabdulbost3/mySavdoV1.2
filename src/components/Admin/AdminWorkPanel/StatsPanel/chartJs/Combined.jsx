import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GetActivity } from "../../../../../Redux/activity";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function CombinedChart({ selectedYear }) {
    const dispatch = useDispatch();
    const dataActivity = useSelector((state) => state.activity);
    const [chartData, setChartData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        dispatch(GetActivity());
    }, [dispatch]);

    useEffect(() => {
        if (dataActivity?.getActivity?.Data?.data?.data) {
            const years = Array.from(
                new Set(
                    dataActivity.getActivity.Data.data.data.map(elem =>
                        new Date(elem.createdAt).getFullYear()
                    )
                )
            ).sort((a, b) => a - b);
            setAvailableYears(years);
        }
    }, [dataActivity]);

    useEffect(() => {
        if (dataActivity?.getActivity?.Data?.data?.data) {
            const benefitsByDay = {};
            const salesByDay = {};

            dataActivity.getActivity.Data.data.data.forEach(elem => {
                const date = new Date(elem.createdAt);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const benefit = elem.sold - elem.in || 0;
                const sale = elem.sold || 0;

                if (year === selectedYear && month === selectedMonth) {
                    const key = `${year}-${month}-${day}`;
                    benefitsByDay[key] = (benefitsByDay[key] || 0) + benefit;
                    salesByDay[key] = (salesByDay[key] || 0) + sale;
                }
            });

            const mergedData = Object.keys({ ...benefitsByDay, ...salesByDay }).map(date => ({
                date,
                benefit: benefitsByDay[date] || 0,
                sale: salesByDay[date] || 0,
            }));

            setChartData(mergedData);
        }
    }, [dataActivity, selectedMonth, selectedYear]);

    const handleMonthChange = (event) => {
        setSelectedMonth(parseInt(event.target.value));
    };

    const labels = chartData.map(item => moment(item.date).format("DD MMMM"));
    const benefitData = chartData.map(item => item.benefit);
    const saleData = chartData.map(item => item.sale);

    const data = {
        labels,
        datasets: [
            {
                label: "Sotuv",
                data: saleData,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                type: "bar",
                borderWidth: 1,
            },
            {
                label: "Foyda",
                data: benefitData,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                type: "line",
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    color: "#fff",
                    font: {
                        family: "Arial, sans-serif",
                        size: 14,
                    },
                },
            },
            title: {
                display: true,
                text: "Kunlik Foyda va Savdo",
                color: "#fff",
                font: {
                    family: "Arial, sans-serif",
                    size: 20,
                    weight: "bold",
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                borderWidth: 1,
                borderColor: "#000",
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: "#fff",
                    font: {
                        family: "Arial, sans-serif",
                        size: 12,
                    },
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                },
            },
            y: {
                stacked: true,
                ticks: {
                    color: "#fff",
                    font: {
                        family: "Arial, sans-serif",
                        size: 12,
                    },
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                },
            },
        },
    };

    return (
        <div className="CombinedChart">
            <Bar data={data} options={options} />
            <select className="chartMonth" onChange={handleMonthChange} value={selectedMonth}>
                {Array.from({ length: 12 }, (_, index) => (
                    <option key={index} value={index + 1}>
                        {moment().month(index).format("MMMM")}
                    </option>
                ))}
            </select>
        </div>
    );
}
