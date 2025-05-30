import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ToastType = "success" | "error";

interface Toast {
  message: string;
  type: ToastType;
}

interface UIState {
  isModalOpen: boolean;
  toast: Toast | null;
  loading: boolean;
}

const initialState: UIState = {
  isModalOpen: false,
  toast: null,
  loading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
    showToast(state, action: PayloadAction<Toast>) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { openModal, closeModal, showToast, clearToast, setLoading } =
  uiSlice.actions;
export default uiSlice.reducer;
