import store from "./store";
import sitewide from "../../store";
import axios from "axios";

export default class Logic {
  constructor() {
    this.domain = sitewide((s) => s.domainName);
    this.url = "http://" + this.domain + "/api/";
    this.accounts = store((s) => s.accounts);
    this.setAccounts = store((s) => s.setAccounts);

    this.rawBalances = store((s) => s.rawBalances);
    this.setRawBalances = store((s) => s.setRawBalances);

    this.balances = store((s) => s.balances);
    this.setBalances = store((s) => s.setBalances);
  }

  run() {
    this.loadAllAccounts();
    this.loadAccountBalances();
    this.renameAccounts();
  }

  async loadAllAccounts() {
    const response = await axios.post(url, { meta: "load_accounts" });
    const accounts = response.data;
    this.setAccounts(accounts);
  }

  async loadAccountBalances() {
    const response = await axios.post(url, { meta: "check_balances" });
    this.setRawBalances(response.data);
  }

  countDecimalPlaces(number) {
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

  async renameAccounts() {
    // map out acc_id to its accountName
    const accountNames = this.accounts.reduce((map, obj) => {
      map[obj.acc_id] = obj.account;
      return map;
    }, {});

    // for each record, add the accountName associated with acc_id
    const balances = this.rawBalances.map((item) => {
      const account = accountNames[item.acc_id];
      const balance = parseFloat(item.balance);

      // truncate trailing zeroes in the balance
      const decimalPlace = this.countDecimalPlaces(item.balance);
      return {
        ...item,
        account: account || null,
        balance: balance.toFixed(decimalPlace),
      };
    });

    // sort account records by name (a-z)
    const balances_sorted = sortBy(balances, "account");
    this.setBalances(balances_sorted);
  }
}
