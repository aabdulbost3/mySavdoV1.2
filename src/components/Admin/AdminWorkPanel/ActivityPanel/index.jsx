import './style.css';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie"

import { GetActivity } from '../../../../Redux/activity';
import LoadingAnimations from '../../../LoadingComponent';
import Error500Page from '../../../500Component';
import EmptyComponent from '../../../emptyComponent';


export default function ActivityPanel() {
    const dispatch = useDispatch();
    const dataActivity = useSelector(state => state.activity);
    const [searchSeriaNumber, setSearchSeriaNumber] = useState(null);
    const [rowId, setRowId] = useState(null);

    useEffect(() => {
        dispatch(GetActivity());
    }, [dispatch]);

    let sortedData = dataActivity.getActivity?.Success
        ? [...dataActivity.getActivity.Data.data.data].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        : [];

    if (searchSeriaNumber) {
        sortedData = sortedData.filter(e => e.imei?.includes(searchSeriaNumber));
    }

    const groupedObject = sortedData.reduce((acc, item) => {
        const dateKey = new Date(item.updatedAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
    }, {});

    const groupedArray = Object.entries(groupedObject).map(([date, data]) => ({
        date,
        data
    }));
    const handleRow = (e) => {
        if (e.target.id !== rowId) {
            setRowId(e.target.id)
        } else { setRowId(null) }
    }

    return (
        <div className="ActivityPanel">
            <div className="PanelTop">
                <form onSubmit={e => e.preventDefault()}>
                    <input type="text" disabled={dataActivity.getActivity?.Loading ? true : false} placeholder="𝄃𝄂𝄂𝄀 IMEI bilan qidirish" onChange={e => setSearchSeriaNumber(e.target.value)} value={searchSeriaNumber} />
                    <button className="fa-solid fa-magnifying-glass" aria-label="search"></button>
                </form>
            </div>
            <div className="receipt_box">
                {dataActivity.getActivity?.Success ? (
                    groupedArray.length > 0 ? (
                        groupedArray.map((elem, index) => {
                            const total = elem.data.reduce((sum, e) => sum + (e.sold || 0), 0);
                            return (
                                <div className="receipt" key={index}>
                                    <header className="receipt__header">
                                        <p className="receipt__title">
                                            MySavdo-{JSON.parse(Cookies.get("user")).name}
                                        </p>
                                        <p className="receipt__date">{elem.date}</p>
                                    </header>
                                    <dl className="receipt__list">
                                        {elem.data.map((e, i) => (
                                            <div className="receipt_row_all">
                                                <div className="receipt__list-row" key={i}>
                                                    <dt className="receipt__item"><i id={e._id} onClick={handleRow} style={rowId === e._id ? { transform: "rotate(90deg)" } : { transform: "rotate(0deg)" }} className="fa-solid fa-circle-chevron-right dataArrow" />{e.model}</dt>
                                                    <dd className="receipt__cost">
                                                        {e.sold || e.sold === 0 ? `${e.sold}$` : "olindi"}
                                                    </dd>
                                                </div>
                                                <div className="receipt_data" style={rowId === e._id ? { display: "block" } : { display: "none" }}>
                                                    <dt className='receipt__item'>
                                                        {e.type !== "default" ? (
                                                            e.sold !== 0 && !e.sold ? (
                                                                "Dataga qo'shildi"
                                                            ) : (
                                                                <>
                                                                    <i className="fa-solid fa-barcode" /> IMEI: {e.imei}
                                                                </>
                                                            )
                                                        ) : (
                                                            "Tez oldi-sotdi"
                                                        )}
                                                    </dt>
                                                    <div className="soldBuy">
                                                        <dd className="receipt__cost">
                                                            {
                                                                e.sold !== 0 && !e.sold ? (
                                                                    <div className="soldCount">
                                                                        <dt className='receipt__item'>{e.quantity} ta {e.model} ni</dt>
                                                                        <i class="fa-solid fa-turn-down" /> Olindi: {e.in * e.quantity}$ ga
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <i class="fa-solid fa-turn-down" /> Olindi: {e.in ? `${e.in}$` : 0}
                                                                    </>
                                                                )
                                                            }
                                                        </dd>
                                                        <dd className="receipt__cost">
                                                            {
                                                                e.sold !== 0 && !e.sold ? (
                                                                    null
                                                                ) : (
                                                                    <>
                                                                        <i class="fa-solid fa-turn-up" /> Sotildi: {e.sold ? `${e.sold}$` : 0}
                                                                    </>
                                                                )
                                                            }
                                                        </dd>
                                                    </div>
                                                    <dt className='receipt__item'>
                                                        {
                                                            e.sold !== 0 && !e.sold ? (
                                                                null
                                                            ) : (
                                                                <>
                                                                    <i class="fa-solid fa-id-badge" /> Sotuvchi: {e.user}
                                                                </>
                                                            )
                                                        }
                                                    </dt>
                                                    <div className="dates">
                                                        <dt className='receipt__item'>
                                                            {
                                                                e.sold !== 0 && !e.sold ? (
                                                                    <>
                                                                        <i class="fa-solid fa-clock" /> Olindi: {new Date(e.createdAt).toLocaleTimeString("en-GB", {hour: "2-digit", minute: "2-digit" })}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i class="fa-solid fa-calendar-days" /> Olindi: {new Date(e.buyTime).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                                                                    </>
                                                                )
                                                            }
                                                        </dt>
                                                        <dt className='receipt__item'>
                                                            {
                                                                e.sold !== 0 && !e.sold ? (
                                                                    null
                                                                ) : (
                                                                    <>
                                                                        <i class="fa-regular fa-clock" /> Sotildi: {new Date(e.updatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                                                    </>
                                                                )
                                                            }
                                                        </dt>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="receipt__list-row receipt__list-row--total">
                                            <dt className="receipt__item">Kunlik sotuv</dt>
                                            <dd className="receipt__cost">{total}$</dd>
                                        </div>
                                    </dl>
                                </div>
                            );
                        })
                    ) : (
                        <EmptyComponent/>
                    )
                ) : dataActivity.getActivity?.Loading ? (
                    <LoadingAnimations />
                ) : dataActivity.getActivity?.Error ? (
                    <Error500Page />
                ) : null}
            </div>
        </div>
    );
};