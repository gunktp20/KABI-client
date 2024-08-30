import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AddUserFunc, IAuthState } from "./types";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";

const token = localStorage.getItem("token");

interface AccessTokenPayload {
  userId: string;
  email: string;
  roles: [];
  iat: number;
  exp: number;
}

const decoded: AccessTokenPayload | undefined = token
  ? jwtDecode(token)
  : undefined;
const user = localStorage.getItem("user");

const initialState: IAuthState = {
  token: token || "",
  userId: decoded?.userId || "",
  email: decoded?.email || "",
  user: user ? JSON.parse(user) : null,
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "error",
};

export const requestVerifyEmail = createAsyncThunk(
  "auth/requestVerifyEmail",
  async (token: string, thunkApi) => {
    try {
      const { data } = await api.put(`/auth/email/`, { token });
      return {
        ...data,
      };
    } catch (err: unknown) {
      console.log(err);
      const msg = await getAxiosErrorMessage(err);
      return thunkApi.rejectWithValue(msg);
    }
  }
);

const addUserToLocalStorage: AddUserFunc = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    displayAlert: (state, action) => {
      const { msg, type } = action.payload;
      return {
        ...state,
        showAlert: true,
        alertText: msg,
        alertType: type,
      };
    },
    clearAlert: (state) => {
      return {
        ...state,
        showAlert: false,
        alertText: "",
        alertType: "error",
      };
    },
    logout: (state) => {
      removeUserFromLocalStorage();
      return {
        ...state,
        user: null,
        token: "",
      };
    },
    setCredential: (state, action) => {
      const { token, user } = action.payload;
      addUserToLocalStorage(token, user);
      return {
        ...state,
        token: action.payload.token,
        user,
      };
    },
    setNotifications: (state, action) => {
      return {
        ...state,
        notifications: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestVerifyEmail.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(requestVerifyEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.showAlert = true;
      state.alertText = "Verified Successfully";
      state.alertType = "success";
      state.token = action.payload.token;
    });
    builder.addCase(requestVerifyEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.showAlert = true;
      state.alertText = action.payload as string;
      state.alertType = "error";
    });
  },
});

export const {
  setCredential,
  displayAlert,
  clearAlert,
  logout,
  setNotifications,
} = AuthSlice.actions;

export default AuthSlice.reducer;
