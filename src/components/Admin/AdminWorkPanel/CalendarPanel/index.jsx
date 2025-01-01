import "./style.css";
import { useState, useEffect } from "react";

export default function CalendarPanel() {
    const [datesMap, setDatesMap] = useState([]);
    const [monthName, setMonthName] = useState("");
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        updateCalendar();
    }, [currentDate]);

    const updateCalendar = () => {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const totalDays = lastDay.getDate();

        const firstDayIndex = (firstDay.getDay() + 6) % 7;
        const lastDayIndex = (lastDay.getDay() + 6) % 7;

        const monthYearString = currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
        });
        setMonthName(monthYearString);

        const newDatesMap = [];

        for (let i = firstDayIndex; i > 0; i--) {
            const prevDate = new Date(currentYear, currentMonth, -i + 1);
            newDatesMap.push({ active: "inactive", data: prevDate.getDate() });
        }

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(currentYear, currentMonth, i);
            const activeClass =
                date.toDateString() === new Date().toDateString() ? "active" : "";
            newDatesMap.push({ active: activeClass, data: i });
        }

        for (let i = 1; i < 7 - lastDayIndex; i++) {
            const nextDate = new Date(currentYear, currentMonth + 1, i);
            newDatesMap.push({ active: "inactive", data: nextDate.getDate() });
        }

        setDatesMap(newDatesMap);
    };

    const prevBtnAction = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const nextBtnAction = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    return (
        <div className="CalendarPanel">
            <div className="header">
                <button className="prevBtn" onClick={prevBtnAction}>
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="monthYear">{monthName}</div>
                <button className="nextBtn" onClick={nextBtnAction}>
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>
            <div className="days">
                <div className="day">Mon</div>
                <div className="day">Tue</div>
                <div className="day">Wed</div>
                <div className="day">Thu</div>
                <div className="day">Fri</div>
                <div className="day">Sat</div>
                <div className="day">Sun</div>
            </div>
            <div className="dates">
                {datesMap.map((e, index) => (
                    <div key={index} className={`date ${e.active}`}>
                        {e.data}
                    </div>
                ))}
            </div>
        </div>
    );
}
