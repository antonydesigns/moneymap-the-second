import { create } from "zustand";

const store = create((set) => ({
  transactionSubmitted: false,
  setTrxSubmitted: (data) => set({ transactionSubmitted: data }),
}));

export default store;
