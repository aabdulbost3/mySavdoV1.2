import "./style.css"

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GetActivity } from '../../../../Redux/activity';
import LoadingAnimations from '../../../LoadingComponent';
import Error500Page from '../../../500Component';
import EmptyComponent from '../../../emptyComponent';

export default function ArchivePanel() {
    const dispatch = useDispatch();
    const dataActivity = useSelector(state => state.activity);
    const [searchSeriaNumber, setSearchSeriaNumber] = useState(null);
    const [copyId, setCopyId] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    useEffect(() => {
        dispatch(GetActivity());
    }, [dispatch]);

    let sortedData = dataActivity.getActivity?.Success
        ? [...dataActivity.getActivity.Data.data.data.filter(e => (e.sold || e.sold === 0) && e.type !== "default")].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
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
    const copyToClipboard = (id, text) => {
        setCopyId(id);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
            setCopyId(null);
        }, 2000);
    };
    return (
        <div className="ArchivePanel">
            <div className="PanelTop">
                <form onSubmit={e => e.preventDefault()}>
                    <input type="text" disabled={dataActivity.getActivity?.Loading ? true : false} placeholder="𝄃𝄂𝄂𝄀 IMEI bilan qidirish" onChange={e => setSearchSeriaNumber(e.target.value)} value={searchSeriaNumber} />
                    <button className="fa-solid fa-magnifying-glass" aria-label="search"></button>
                </form>
            </div>
            <div className="productsBox">
                {dataActivity.getActivity?.Success ? (
                    groupedArray.length > 0 ? (
                        groupedArray.map((elem, index) => {
                            return (
                                <div className="product" key={index}>
                                    <h2>{elem.date}</h2>
                                    {elem.data.map((e, i) => (
                                        <div className="productPanel">
                                            <div className="mainPanel">
                                                {e.image ? <img src={e.image} alt={`Model: ${e.model}`} /> : <i className="imageIcon fa-solid fa-image" />}
                                                <h3 title="modeli">{e.model}</h3>
                                                <h4 key={e._id} className="imei" onMouseEnter={() => setHoveredId(e._id)} onMouseLeave={() => setHoveredId(null)}>
                                                    <div className="copyStatus" style={hoveredId === e._id ? { display: "flex" } : { display: "none" }} onClick={() => copyToClipboard(e._id, e.imei)}>
                                                        <i className={copyId === e._id ? "fa-solid fa-copy" : "fa-regular fa-copy"}/>
                                                        <h5>
                                                            {copyId === e._id ? "Copied" : "Copy"}
                                                        </h5>
                                                    </div>
                                                    <span className="fa-solid fa-barcode" />
                                                    IMEI:
                                                    <span key={e._id} onClick={() => copyToClipboard(e._id, e.imei)} style={{ cursor: "pointer" }}>
                                                        {e.imei}
                                                    </span>
                                                </h4>
                                            </div>
                                            <div className="secondPanel">
                                                <div className="buyPanel">
                                                    <h4><span className="fa-solid fa-money-bill-1" /> Olindi: <span>{e.in}$</span></h4>
                                                    <h4><span className="fa-solid fa-calendar-days" /> Olingan kun: <span>{new Date(e.buyTime).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></h4>
                                                </div>
                                                <div className="buyPanel">
                                                    <h4><span className="fa-regular fa-money-bill-1" /> Sotildi: <span>{e.sold}$</span></h4>
                                                    <h4><span className="fa-regular fa-clock" /> Sotilgan vaqt: <span>{new Date(e.updatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span></h4>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        })
                    ) : (
                        <EmptyComponent />
                    )
                ) : dataActivity.getActivity?.Loading ? (
                    <LoadingAnimations />
                ) : dataActivity.getActivity?.Error ? (
                    <Error500Page />
                ) : null}
            </div>
        </div>
    )
}