import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL, config } from "../../utils";

export const GetActivityId = createAsyncThunk("activity/getById", async (editId) => {
    const response = await axios.get(`${API_URL}/activity/${editId}`, config);
    return response;
});

export const GetActivity = createAsyncThunk("activity/getAll", async () => {
    const response = await axios.get(`${API_URL}/activity`, config);
    return response;
});

export const PostDefaultActivity = createAsyncThunk("activity/post", async (body) => {
    const response = await axios.post(`${API_URL}/activity`,body, config);
    return response;
});

export const PutDefaultActivity = createAsyncThunk("activity/put", async ({body,id}) => {
    const response = await axios.put(`${API_URL}/activity/${id}`,body, config);
    return response;
});

export const DeleteDefaultActivity = createAsyncThunk("activity/delete", async (id) => {
    const response = await axios.delete(`${API_URL}/activity/${id}`, config);
    return response;
});

const ActivitySlice = createSlice({
    name: "Activity",
    initialState: {
        getActivity: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        getActivityId: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        postDefaultActivity: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        putDefaultActivity: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        deleteDefaultActivity: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetActivity.pending, (state) => {
                state.getActivity.Loading = true;
                state.getActivity.Error = null;
                state.getActivity.Success = false;
            })
            .addCase(GetActivity.fulfilled, (state, action) => {
                state.getActivity.Loading = false;
                state.getActivity.Error = null;
                state.getActivity.Success = true;
                state.getActivity.Data = action.payload;
            })
            .addCase(GetActivity.rejected, (state, action) => {
                state.getActivity.Loading = false;
                state.getActivity.Error = action.error.message;
                state.getActivity.Success = false;
                state.getActivity.Data = null;
            })
            .addCase(GetActivityId.pending, (state) => {
                state.getActivityId.Loading = true;
                state.getActivityId.Error = null;
                state.getActivityId.Success = false;
            })
            .addCase(GetActivityId.fulfilled, (state, action) => {
                state.getActivityId.Loading = false;
                state.getActivityId.Error = null;
                state.getActivityId.Success = true;
                state.getActivityId.Data = action.payload;
            })
            .addCase(GetActivityId.rejected, (state, action) => {
                state.getActivityId.Loading = false;
                state.getActivityId.Error = action.error.message;
                state.getActivityId.Success = false;
                state.getActivityId.Data = null;
            })
            .addCase(PostDefaultActivity.pending, (state) => {
                state.postDefaultActivity.Loading = true;
                state.postDefaultActivity.Error = null;
                state.postDefaultActivity.Success = false;
            })
            .addCase(PostDefaultActivity.fulfilled, (state, action) => {
                state.postDefaultActivity.Loading = false;
                state.postDefaultActivity.Error = null;
                state.postDefaultActivity.Success = true;
                state.postDefaultActivity.Data = action.payload;
            })
            .addCase(PostDefaultActivity.rejected, (state, action) => {
                state.postDefaultActivity.Loading = false;
                state.postDefaultActivity.Error = action.error.message;
                state.postDefaultActivity.Success = false;
                state.postDefaultActivity.Data = null;
            })
            .addCase(PutDefaultActivity.pending, (state) => {
                state.putDefaultActivity.Loading = true;
                state.putDefaultActivity.Error = null;
                state.putDefaultActivity.Success = false;
            })
            .addCase(PutDefaultActivity.fulfilled, (state, action) => {
                state.putDefaultActivity.Loading = false;
                state.putDefaultActivity.Error = null;
                state.putDefaultActivity.Success = true;
                state.putDefaultActivity.Data = action.payload;
            })
            .addCase(PutDefaultActivity.rejected, (state, action) => {
                state.putDefaultActivity.Loading = false;
                state.putDefaultActivity.Error = action.error.message;
                state.putDefaultActivity.Success = false;
                state.putDefaultActivity.Data = null;
            })
            .addCase(DeleteDefaultActivity.pending, (state) => {
                state.deleteDefaultActivity.Loading = true;
                state.deleteDefaultActivity.Error = null;
                state.deleteDefaultActivity.Success = false;
            })
            .addCase(DeleteDefaultActivity.fulfilled, (state, action) => {
                state.deleteDefaultActivity.Loading = false;
                state.deleteDefaultActivity.Error = null;
                state.deleteDefaultActivity.Success = true;
                state.deleteDefaultActivity.Data = action.payload;
            })
            .addCase(DeleteDefaultActivity.rejected, (state, action) => {
                state.deleteDefaultActivity.Loading = false;
                state.deleteDefaultActivity.Error = action.error.message;
                state.deleteDefaultActivity.Success = false;
                state.deleteDefaultActivity.Data = null;
            })
    }
});

export const {} = ActivitySlice.actions;
export default ActivitySlice.reducer;