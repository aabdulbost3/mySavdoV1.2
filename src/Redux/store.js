import { configureStore } from "@reduxjs/toolkit";
import AdminSlice from "./admin/index"
import SaleSlice from "./sale/index"
import DataSlice from "./data/index"
import ActivitySlice from "./activity/index"

export const store = configureStore({
    reducer:{
        admin: AdminSlice,
        sale: SaleSlice,
        data: DataSlice,
        activity: ActivitySlice,
    }
})