import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL, config } from "../../utils";

export const PostSale = createAsyncThunk("sale/post", async ({id,body}) => {
    const response = await axios.post(`${API_URL}/sale/${id}`, body, config);
    return response;
});

const SaleSlice = createSlice({
    name: "Sale",
    initialState: {
        postSale: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(PostSale.pending, (state) => {
                state.postSale.Loading = true;
                state.postSale.Error = null;
                state.postSale.Success = false;
            })
            .addCase(PostSale.fulfilled, (state, action) => {
                state.postSale.Loading = false;
                state.postSale.Error = null;
                state.postSale.Success = true;
                state.postSale.Data = action.payload;
            })
            .addCase(PostSale.rejected, (state, action) => {
                state.postSale.Loading = false;
                state.postSale.Error = action.error.message;
                state.postSale.Success = false;
                state.postSale.Data = null;
            })
    }
});

export const {} = SaleSlice.actions;
export default SaleSlice.reducer;