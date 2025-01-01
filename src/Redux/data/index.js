import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL, config } from "../../utils";

export const GetDataId = createAsyncThunk("data/getById", async (editId) => {
    const response = await axios.get(`${API_URL}/data/${editId}`, config);
    return response;
});

export const GetData = createAsyncThunk("data/get", async () => {
    const response = await axios.get(`${API_URL}/data`, config);
    return response;
});

export const DeleteData = createAsyncThunk("data/delete", async (id) => {
    const response = await axios.delete(`${API_URL}/data/${id}`, config);
    return response;
});

export const PostData = createAsyncThunk("data/post", async (body) => {
    const response = await axios.post(`${API_URL}/data`, body, config);
    return response;
});

export const PutData = createAsyncThunk("sata/put", async ({id,body}) => {
    const response = await axios.put(`${API_URL}/data/${id}`, body, config);
    return response;
});

const DataSlice = createSlice({
    name: "Data",
    initialState: {
        getData: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        getDataId: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        deleteData: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        postData: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        putData: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetData.pending, (state) => {
                state.getData.Loading = true;
                state.getData.Error = null;
                state.getData.Success = false;
            })
            .addCase(GetData.fulfilled, (state, action) => {
                state.getData.Loading = false;
                state.getData.Error = null;
                state.getData.Success = true;
                state.getData.Data = action.payload;
            })
            .addCase(GetData.rejected, (state, action) => {
                state.getData.Loading = false;
                state.getData.Error = action.error.message;
                state.getData.Success = false;
                state.getData.Data = null;
            })
            .addCase(GetDataId.pending, (state) => {
                state.getDataId.Loading = true;
                state.getDataId.Error = null;
                state.getDataId.Success = false;
            })
            .addCase(GetDataId.fulfilled, (state, action) => {
                state.getDataId.Loading = false;
                state.getDataId.Error = null;
                state.getDataId.Success = true;
                state.getDataId.Data = action.payload;
            })
            .addCase(GetDataId.rejected, (state, action) => {
                state.getDataId.Loading = false;
                state.getDataId.Error = action.error.message;
                state.getDataId.Success = false;
                state.getDataId.Data = null;
            })
            .addCase(DeleteData.pending, (state) => {
                state.deleteData.Loading = true;
                state.deleteData.Error = null;
                state.deleteData.Success = false;
            })
            .addCase(DeleteData.fulfilled, (state, action) => {
                state.deleteData.Loading = false;
                state.deleteData.Error = null;
                state.deleteData.Success = true;
                state.deleteData.Data = action.payload;
            })
            .addCase(DeleteData.rejected, (state, action) => {
                state.deleteData.Loading = false;
                state.deleteData.Error = action.error.message;
                state.deleteData.Success = false;
                state.deleteData.Data = null;
            })
            .addCase(PostData.pending, (state) => {
                state.postData.Loading = true;
                state.postData.Error = null;
                state.postData.Success = false;
            })
            .addCase(PostData.fulfilled, (state, action) => {
                state.postData.Loading = false;
                state.postData.Error = null;
                state.postData.Success = true;
                state.postData.Data = action.payload;
            })
            .addCase(PostData.rejected, (state, action) => {
                state.postData.Loading = false;
                state.postData.Error = action.error.message;
                state.postData.Success = false;
                state.postData.Data = null;
            })
            .addCase(PutData.pending, (state) => {
                state.putData.Loading = true;
                state.putData.Error = null;
                state.putData.Success = false;
            })
            .addCase(PutData.fulfilled, (state, action) => {
                state.putData.Loading = false;
                state.putData.Error = null;
                state.putData.Success = true;
                state.putData.Data = action.payload;
            })
            .addCase(PutData.rejected, (state, action) => {
                state.putData.Loading = false;
                state.putData.Error = action.error.message;
                state.putData.Success = false;
                state.putData.Data = null;
            });
    }
});

export const {} = DataSlice.actions;
export default DataSlice.reducer;