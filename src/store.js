import { create } from "zustand";

const store = create((set) => ({
  domainName: "moneymap.test",
  page: "Home",
  setPage: (data) => set({ page: data }),

  // transactions
  rawBalances: [],
  setRawBalances: (data) => set({ rawBalances: data }),

  // accounts
  accounts: [],
  setAccounts: (data) => set({ accounts: data }),

  // select accounts
  selected: "",
  setSelected: (data) => set({ selected: data }),

  // balance of the selected account
  currentBalance: 0,
  setCurrentBalance: (data) => set({ currentBalance: data }),

  // resulting balance after change
  afterBalance: 0,
  setAfterBalance: (data) => set({ afterBalance: data }),

  // enter money change
  add: "",
  setAdd: (data) => set({ add: data }),

  // add account fields
  addAccountON: false,
  setAddAccountON: (data) => set({ addAccountON: data }),

  // the account to add
  newAccount: "",
  setNewAccount: (data) => set({ newAccount: data }),

  // balances of ALL accounts
  balances: "",
  setBalances: (data) => set({ balances: data }),

  // general state change indicator
  stateChange: true,
  setStateChange: (data) => set({ stateChange: data }),

  // warnings
  warn: {
    overdraft: false,
    empty_input_add: true,
  },
  setWarn: (data) => set((state) => ({ warn: { ...state.warn, ...data } })),
}));

export default store;
