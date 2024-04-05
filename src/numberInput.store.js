import { create } from "zustand";

const store = create((set) => ({
  num: "",
  setNum: (data) => set({ num: data }),
}));

export default store;
