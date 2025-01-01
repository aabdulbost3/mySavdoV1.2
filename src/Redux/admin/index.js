import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL, config } from "../../utils";

export const GetAdminId = createAsyncThunk("admin/getById", async (editId) => {
    const response = await axios.get(`${API_URL}/admin/${editId}`, config);
    return response;
});

export const GetAdmin = createAsyncThunk("admin/getAll", async () => {
    const response = await axios.get(`${API_URL}/admin`, config);
    return response;
});

export const DeleteAdmin = createAsyncThunk("admin/delete", async (id) => {
    const response = await axios.delete(`${API_URL}/admin/${id}`, config);
    return response;
});

export const PostAdmin = createAsyncThunk("admin/post", async (body) => {
    const response = await axios.post(`${API_URL}/admin`, body, config);
    return response;
});

export const PutAdmin = createAsyncThunk("admin/put", async ({editId,body}) => {
    const response = await axios.put(`${API_URL}/admin/${editId}`, body, config);
    return response;
});

const AdminSlice = createSlice({
    name: "Admin",
    initialState: {
        getAdmin: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        getAdminId: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        deleteAdmin: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        postAdmin: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        },
        putAdmin: {
            Loading: false,
            Error: null,
            Success: false,
            Data: null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetAdmin.pending, (state) => {
                state.getAdmin.Loading = true;
                state.getAdmin.Error = null;
                state.getAdmin.Success = false;
            })
            .addCase(GetAdmin.fulfilled, (state, action) => {
                state.getAdmin.Loading = false;
                state.getAdmin.Error = null;
                state.getAdmin.Success = true;
                state.getAdmin.Data = action.payload;
            })
            .addCase(GetAdmin.rejected, (state, action) => {
                state.getAdmin.Loading = false;
                state.getAdmin.Error = action.error.message;
                state.getAdmin.Success = false;
                state.getAdmin.Data = null;
            })
            .addCase(GetAdminId.pending, (state) => {
                state.getAdminId.Loading = true;
                state.getAdminId.Error = null;
                state.getAdminId.Success = false;
            })
            .addCase(GetAdminId.fulfilled, (state, action) => {
                state.getAdminId.Loading = false;
                state.getAdminId.Error = null;
                state.getAdminId.Success = true;
                state.getAdminId.Data = action.payload;
            })
            .addCase(GetAdminId.rejected, (state, action) => {
                state.getAdminId.Loading = false;
                state.getAdminId.Error = action.error.message;
                state.getAdminId.Success = false;
                state.getAdminId.Data = null;
            })
            .addCase(DeleteAdmin.pending, (state) => {
                state.deleteAdmin.Loading = true;
                state.deleteAdmin.Error = null;
                state.deleteAdmin.Success = false;
            })
            .addCase(DeleteAdmin.fulfilled, (state, action) => {
                state.deleteAdmin.Loading = false;
                state.deleteAdmin.Error = null;
                state.deleteAdmin.Success = true;
                state.deleteAdmin.Data = action.payload;
            })
            .addCase(DeleteAdmin.rejected, (state, action) => {
                state.deleteAdmin.Loading = false;
                state.deleteAdmin.Error = action.error.message;
                state.deleteAdmin.Success = false;
                state.deleteAdmin.Data = null;
            })
            .addCase(PostAdmin.pending, (state) => {
                state.postAdmin.Loading = true;
                state.postAdmin.Error = null;
                state.postAdmin.Success = false;
            })
            .addCase(PostAdmin.fulfilled, (state, action) => {
                state.postAdmin.Loading = false;
                state.postAdmin.Error = null;
                state.postAdmin.Success = true;
                state.postAdmin.Data = action.payload;
            })
            .addCase(PostAdmin.rejected, (state, action) => {
                state.postAdmin.Loading = false;
                state.postAdmin.Error = action.error.message;
                state.postAdmin.Success = false;
                state.postAdmin.Data = null;
            })
            .addCase(PutAdmin.pending, (state) => {
                state.putAdmin.Loading = true;
                state.putAdmin.Error = null;
                state.putAdmin.Success = false;
            })
            .addCase(PutAdmin.fulfilled, (state, action) => {
                state.putAdmin.Loading = false;
                state.putAdmin.Error = null;
                state.putAdmin.Success = true;
                state.putAdmin.Data = action.payload;
            })
            .addCase(PutAdmin.rejected, (state, action) => {
                state.putAdmin.Loading = false;
                state.putAdmin.Error = action.error.message;
                state.putAdmin.Success = false;
                state.putAdmin.Data = null;
            });
    }
});

export const {} = AdminSlice.actions;
export default AdminSlice.reducer;