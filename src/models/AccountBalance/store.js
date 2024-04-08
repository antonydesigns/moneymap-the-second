import { create } from "zustand";

const store = create((set) => ({
  test: 123,
  setTest: (data) => set({ test: data }),

  accounts: [],
  setAccounts: (data) => set({ accounts: data }),

  rawBalances: [],
  setRawBalances: (data) => set({ rawBalances: data }),

  balances: "",
  setBalances: (data) => set({ balances: data }),

  info: {
    greeting: "hello",
  },
  setInfo: (data) => set((state) => ({ info: { ...state.info, ...data } })),
}));

export default store;
