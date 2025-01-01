import "./style.css";

import ActivityPanel from "./ActivityPanel";
import FullWidthDetailPanel from "./DataPanel";
import  {EntrancePanel}  from "./EntrancePanel";
import { StatsPanel } from "./StatsPanel";
import UsersPanel from "./UsersPanel";
import ArchivePanel from "./ArchivePanel";

export function WorkPanel() {
    const backgroundColors = {
        "/AdminPage/data": "#EEEEEE",
        "/AdminPage/data/addProduct": "#EEEEEE",
        "/AdminPage/admins": "#E8E8E8",
        "/AdminPage/checks": "#212121",
        "/AdminPage/statistics": "#121212",
        "/AdminPage/archive": "#EEEEEE",
        "/AdminPage": "#EEEEEE",
    };
    
    const defaultColor = "#EEEEEE";
    const currentPath = window.location.pathname;
    
    document.documentElement.style.setProperty(
        '--dashboard-background',
        backgroundColors[currentPath] || defaultColor
    );    
    return(
        <div className="WorkPanel">
            {
                window.location.pathname === "/AdminPage/data" ? <FullWidthDetailPanel/>:
                window.location.pathname === "/AdminPage/data/addProduct" ? <FullWidthDetailPanel/>:
                window.location.pathname === "/AdminPage/admins" ? <UsersPanel/> :
                window.location.pathname === "/AdminPage/checks" ? <ActivityPanel/> :
                window.location.pathname === "/AdminPage/statistics" ? <StatsPanel/> :
                window.location.pathname === "/AdminPage/archive" ? <ArchivePanel/> :
                window.location.pathname === "/AdminPage" ? <EntrancePanel/> : null
            }
        </div>
    );
}

