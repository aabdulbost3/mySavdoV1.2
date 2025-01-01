import "./style.css";

import { Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import ModalSecretModal from './ModalSecretModal';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { GetActivity } from '../../../../Redux/activity';

function Row(props) {
    const { row, isEven } = props;
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow  sx={{backgroundColor: isEven ? "#E8E8E8" : "#FFF"}}>
                <TableCell sx={{width: "5%"}}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold",width: "20%" }} >{row.date}</TableCell>
                <TableCell sx={{ fontWeight: "bold",width: "25%" }} align="right">{row.profit}</TableCell>
                <TableCell sx={{ fontWeight: "bold",width: "25%" }} align="right">{row.sale}</TableCell>
                <TableCell sx={{ fontWeight: "bold",width: "25%",pr:"2%" }} align="right">{row.benefit}</TableCell>
            </TableRow>
            <TableRow sx={{backgroundColor: isEven ? "#E8E8E8" : "#FFF"}}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <ModalSecretModal date={row.date} />
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export function DailyRows() {
    const heightRef = useRef();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const dataActivity = useSelector(state => state.activity);
    useEffect(() => {
        const setHeight = () => { if (heightRef.current) heightRef.current.style.height = `${window.innerHeight - 0.15 * window.innerHeight}px` };
        setHeight();
        window.addEventListener("resize", setHeight);
        return () => {
            window.removeEventListener("resize", setHeight);
        };
    }, []);
    useEffect(() => {
        dispatch(GetActivity());
    }, [dispatch]);

    const tables = [];
    const data = dataActivity?.getActivity?.Data?.data?.data || [];

    const removeDuplicateDays = (arr) => {
        const seenDays = new Set();
        return arr.filter(item => {
            const day = item.createdAt.split('T')[0];
            if (seenDays.has(day)) {
                return false;
            }
            seenDays.add(day);
            return true;
        });
    };

    const removeDuplicateMonths = (arr) => {
        const seenMonths = new Set();
        return arr.filter(item => {
            const month = new Date(item.createdAt).toLocaleString('en-US', { month: "long" });
            if (seenMonths.has(month)) {
                return false;
            }
            seenMonths.add(month);
            return true;
        });
    };

    const filteredMonth = removeDuplicateMonths(data);

    filteredMonth.forEach(e => {
        const currentMonth = new Date(e.createdAt).toLocaleString('en-US', { month: "long" })
        const sameMonth = data.filter(elem => new Date(elem.createdAt).toLocaleString('en-US', { month: "long" }) === currentMonth);
        const rows = [];
        let monthProfit = 0, monthProfitQuantity = 0, monthSold = 0, monthSoldQuantity = 0, monthBenefit = 0;
        const filteredData = removeDuplicateDays(sameMonth);

        filteredData.forEach(el => {
            const sameData = data.filter(elem => elem.createdAt.split('T')[0] === el.createdAt.split('T')[0]);
            let profit = 0, profitQuantity = 0, sold = 0, soldQuantity = 0, benefit = 0;

            sameData.forEach(elem => {
                if (!elem.sold && !elem.sold == 0) {
                    profit += elem.in * elem.stQuantity || 0;
                    profitQuantity += elem.stQuantity || 0;
                    monthProfit += elem.in * elem.stQuantity || 0;
                    monthProfitQuantity += elem.stQuantity || 0;
                }
                sold += elem.sold || 0;
                monthSold += elem.sold || 0;
                if (elem.sold || elem.sold == 0) {
                    soldQuantity += 1;
                    monthSoldQuantity += 1;
                    benefit = Math.round((benefit + (elem.sold - elem.in || 0) + Number.EPSILON) * 100) / 100 || 0;
                    monthBenefit = Math.round((monthBenefit + (elem.sold - elem.in || 0) + Number.EPSILON) * 100) / 100 || 0;
                }
            });

            rows.push({
                date: `${new Date(el.createdAt).toLocaleDateString('en-En', { day: 'numeric', month: 'long', year: 'numeric' })}y`,
                profit: `${profitQuantity} ta mahsulot ${profit}$ ga`,
                sale: `${soldQuantity} ta mahsulot ${sold}$ ga`,
                benefit: `${soldQuantity} ta mahsulot ${benefit}$ ga ${benefit >= 0 ? "" : "🔴"}`,
                createdAt: el.createdAt
            });
        });

        const today = dayjs().locale('en').format('MMMM D, YYYY') + 'y';
        rows.map(row => {
            if (new Date(row.createdAt).toLocaleString('en-US', { month: "long" }) === new Date().toLocaleString('en-US', { month: "long" })) {
                if (!rows.some(row => row.date === today)) {
                    rows.push({
                        date: today,
                        profit: `0ta mahsulot 0$ ga`,
                        sale: `0ta mahsulot 0$ ga`,
                        benefit: `0ta mahsulot 0$ ga`
                    });
                }
            }
        })

        tables.push({
            month: currentMonth,
            monthProfit,
            monthProfitQuantity,
            monthSold,
            monthSoldQuantity,
            monthBenefit,
            rows
        });
    });

    if (!tables.some(item => item.month === new Date().toLocaleString('en-US', { month: "long" }))) {
        const rows = [
            {
                date: dayjs().locale('en').format('MMMM D, YYYY') + 'y',
                profit: `0ta mahsulot 0$ ga`,
                sale: `0ta mahsulot 0$ ga`,
                benefit: `0ta mahsulot 0$ ga`
            }
        ]
        tables.push({
            month: new Date().toLocaleString('en-US', { month: "long" }),
            monthProfit: 0,
            monthProfitQuantity: 0,
            monthSold: 0,
            monthSoldQuantity: 0,
            monthBenefit: 0,
            rows
        });
    }

    return (
        <TableContainer sx={{ width: "100%", mb: 4, borderRadius: 2, paddingLeft: "0.5%", paddingRight: "2.5%" }}>
            {tables.reverse().map((table, index) => (
                <Table key={index} sx={{ mb: 6, borderRadius: 2, overflow: "hidden", boxShadow: "4px 0px 8px rgba(0, 0, 0, 0.1), -4px 0px 8px rgba(0, 0, 0, 0.1)", }} component={Paper}>
                    <TableHead sx={{ borderRadius: 2, bgcolor: "primary.light", color: "white" }}>
                        <TableRow sx={{ borderRadius: 2 }}>
                            <TableCell sx={{ display: "flex", borderRadius: 2, alignItems: "center", p: 0, fontSize: "1.1rem", border: 0, fontWeight: "bold", }}>
                                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(table.month)} sx={{ color: "white", mr: 1 }}>
                                    {open === table.month ? null : <KeyboardArrowDown />}
                                </IconButton>
                                <Typography variant="h6" sx={{ mr: 2, color: "primary.contrastText", borderRight: 3, borderColor: "white", pr: 1, borderRadius: 0.5 }}>
                                    {table.month}
                                </Typography>
                                <Typography variant="h7" sx={{ mr: 3, py: 0.3,borderRadius: 1, borderColor: "primary.light", backgroundColor: "white", color: "primary", display: "flex" }}>
                                    <h2>📈</h2> Oylik kirim: <strong>{table.monthProfit}$ 💵</strong>
                                </Typography>
                                <Typography variant="h7" sx={{ mr: 3, color: "primary.contrastText", display: "flex" }}>
                                    <h2>📊</h2> Oylik kirim soni: <strong>{table.monthProfitQuantity} ta</strong>
                                </Typography>
                                <Typography variant="h7" sx={{ mr: 3, py: 0.3,borderRadius: 1, borderColor: "primary.light", backgroundColor: "white", color: "primary", display: "flex" }}>
                                    <h2>📉</h2>Oylik sotuv: <strong>{table.monthSold}$ 💵</strong>
                                </Typography>
                                <Typography variant="h7" sx={{ mr: 3, color: "primary.contrastText", display: "flex" }}>
                                    <h2>📊</h2> Oylik sotuv soni: <strong>{table.monthSoldQuantity} ta</strong>
                                </Typography>
                                <Typography variant="h7" sx={{ py: 0.3,borderRadius: 1, borderColor: "primary.light", backgroundColor: "white", color: "primary", display: "flex" }}>
                                    {table.monthBenefit >= 0 ? "🟢" : "🔴"}Oylik foyda: <strong>{table.monthBenefit}$ 💵</strong>
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ paddingBottom: 25, paddingTop: 25 }} colSpan={6}>
                                <Collapse in={table.month === open} timeout="auto" unmountOnExit>
                                    <Table
                                        className="DailyTable"
                                        aria-label="collapsible table EntrancePanel EntrancePanelTable"
                                        sx={{
                                            borderRadius: "8px",
                                            overflow: "hidden",
                                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    boxShadow: "8px 4px 8px rgba(0, 0, 0, 0.1)",
                                                    "& > *": {
                                                        border: 0,
                                                        fontWeight: "bold",
                                                        color: "#333",
                                                        fontSize: "1.05rem"
                                                    },
                                                }}
                                            >
                                                <TableCell />
                                                <TableCell><h2>🗓️ Sana</h2></TableCell>
                                                <TableCell align="right"><h3>🔽 Kunli Kirim</h3></TableCell>
                                                <TableCell align="right"><h3>🔼 Kunli Sovda</h3></TableCell>
                                                <TableCell align="right" sx={{pr:"2%"}}><h3>↗️ Kunli Foyda</h3></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="TableBody">
                                            {table.rows.reverse().map((row, index) => (
                                                <Row
                                                    key={row.date}
                                                    row={row}
                                                    isEven={index % 2 === 0}
                                                />
                                            ))}
                                        </TableBody>
                                    </Table>

                                </Collapse>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            ))}
        </TableContainer>

    );
}