import { lazy } from 'react'
import Cookies from "js-cookie"
const AdminPage = lazy(()=> import('../Pages/Admin/index.jsx'))
const LoginPage = lazy(()=> import('../Pages/LoginPage'))
const NotfoundPage = lazy(() => import('../Pages/NotfoundPage'))

export const DataRouterjson = [
    {
        id : 1,
        path : '/AdminPage',
        Element : <AdminPage /> 
    },
    {
        id : 2,
        path : '/AdminPage/data',
        Element : <AdminPage /> 
    },
    {
        id : 4,
        path : '/AdminPage/checks',
        Element : <AdminPage /> 
    },
    {
        id : 5,
        path : '/AdminPage/admins',
        Element : JSON.parse(Cookies.get("user") || JSON.stringify({role: "user"})).role == "admin" ? <AdminPage /> :<NotfoundPage/> 
    },
    {
        id : 6,
        path : '/',
        Element : <LoginPage /> 
    },
    {   id : 7,
        path : '/*',
        Element : <NotfoundPage />
    },
    {
        id : 8,
        path : '/AdminPage/data/addProduct',
        Element : <AdminPage /> 
    },
    {
        id : 9,
        path : '/AdminPage/statistics',
        Element : <AdminPage /> 
    },
    {
        id : 10,
        path : '/AdminPage/archive',
        Element : <AdminPage /> 
    }
]