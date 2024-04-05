import axios from "axios";
import store from "./accountBalance.store";

const {
  domainName,
  setAccounts,
  setRawBalances,
  accounts,
  rawBalances,
  balances,
  setBalances,
} = store.getState();

const url = "http://" + domainName + "/api/";

export async function loadAccountNames() {
  const response = await axios.post(url, { meta: "load_accounts" });
  const accounts_ = response.data;
  setAccounts(accounts_);
  console.log("account loaded");
}

export async function loadAccountBalances() {
  const response = await axios.post(url, { meta: "check_balances" });
  const balances_ = response.data;
  setRawBalances(balances_);
  console.log("raw balance loaded");
}

export function renameAccountIDs() {
  const accountNameMap = accounts?.reduce((map, obj) => {
    map[obj.acc_id] = obj.account;
    return map;
  }, {});

  const balances = rawBalances?.map((item) => {
    const account = accountNameMap[item.acc_id];
    return {
      ...item,
      account: account || null,
    };
  });
  setBalances(balances);
  console.log("yo", accounts);
}

export function prettifyAccountBalances() {
  const prettier = balances?.map((item) => {
    const balance = parseFloat(item.balance);
    const decimalPlace = countDecimalPlaces(balance);
    return {
      ...item,
      balance: balance.toFixed(decimalPlace),
    };
  });
  setBalances(prettier);
}

export function countDecimalPlaces(number) {
  const numStr = number.toString();
  const decimalIndex = numStr.indexOf(".");
  if (decimalIndex === -1 || decimalIndex === numStr.length - 1) {
    return 0;
  }
  let count = 0;
  for (let i = decimalIndex + 1; i < numStr.length; i++) {
    if (numStr[i] !== "0") {
      count++;
    }
  }
  return count;
}
