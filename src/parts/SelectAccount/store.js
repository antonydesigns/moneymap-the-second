import { create } from "zustand";

const store = create((set) => ({
  selectedAccount: "",
  setSelectedAccount: (data) => set({ selectedAccount: data }),

  currentBalance: "",
  setCurrentBalance: (data) => set({ currentBalance: data }),

  afterBalance: "",
  setAfterBalance: (data) => set({ afterBalance: data }),

  newAccount: "",
  setNewAccount: (data) => set({ newAccount: data }),

  addAccountField: false,
  setAddAccountField: (data) => set({ addAccountField: data }),
}));

export default store;
