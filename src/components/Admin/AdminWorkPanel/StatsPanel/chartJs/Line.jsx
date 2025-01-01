import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GetActivity } from "../../../../../Redux/activity";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function LineGraph({ selectedYear }) {
  const dispatch = useDispatch();
  const dataActivity = useSelector((state) => state.activity);

  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    dispatch(GetActivity());
  }, [dispatch]);

  useEffect(() => {
    if (dataActivity?.getActivity?.Data?.data?.data) {
      const years = new Set();
      dataActivity.getActivity.Data.data.data.forEach((elem) => {
        const year = new Date(elem.createdAt).getFullYear();
        years.add(year);
      });
      setAvailableYears([...years]);
    }
  }, [dataActivity]);

  if (!dataActivity?.getActivity?.Data?.data?.data || !availableYears.length) {
    return <div>Calculating...</div>;
  }

  let monthlyTotals = { benefit: Array(12).fill(0), sale: Array(12).fill(0), debit: Array(12).fill(0) };
  dataActivity.getActivity.Data.data.data.forEach((elem) => {
    const elemYear = new Date(elem.createdAt).getFullYear();
    if (elemYear === selectedYear) {
      const createdMonth = new Date(elem.createdAt).getMonth();
      const benefit = elem.sold - elem.in || 0;
      const sale = elem.sold || 0;
      let debit = 0;
      if (!elem.sold) debit = elem.in * elem.stQuantity || 0;

      monthlyTotals.benefit[createdMonth] += benefit;
      monthlyTotals.sale[createdMonth] += sale;
      monthlyTotals.debit[createdMonth] += debit;
    }
  });

  const options = {
    responsive: true,
    tension: 0.4,
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
        text: `Yillik Hisobot - ${selectedYear}`,
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

  const LineChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Sotuv",
        data: monthlyTotals.sale,
        fill: true,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        borderWidth: 4,
        pointHoverRadius: 8,
        pointRadius: 6
      },
      {
        label: "Foyda",
        data: monthlyTotals.benefit,
        fill: true,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        borderWidth: 4,
        pointHoverRadius: 8,
        pointRadius: 6
      },
      {
        label: "Kirim",
        data: monthlyTotals.debit,
        fill: true,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        borderWidth: 4,
        pointHoverRadius: 8,
        pointRadius: 6
      },
    ],
  };

  return <Line options={options} data={LineChartData} />
}
