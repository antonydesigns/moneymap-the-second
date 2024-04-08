import store from "./store";
import global from "../../store";
import axios from "axios";
import { sortBy } from "lodash";

export default class Logic {
  constructor() {
    this.domain = global((s) => s.domainName);
    this.url = "http://" + this.domain + "/api/";
    this.accounts;
    this.setAccounts = store((s) => s.setAccounts);
    this.rawBalances;
    this.setBalances = store((s) => s.setBalances);
  }

  async run() {
    await this.loadAllAccounts();
    await this.loadAccountBalances();
    await this.renameAccounts();
  }

  async loadAllAccounts() {
    const response = await axios.post(this.url, { meta: "load_accounts" });
    const accounts = response.data;
    this.accounts = accounts;
    this.setAccounts(accounts);
  }

  async loadAccountBalances() {
    const response = await axios.post(this.url, { meta: "load_raw_balances" });
    this.rawBalances = response.data;
    // console.log(response.data);
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
    const accountNames = await this.accounts?.reduce((map, obj) => {
      map[obj.acc_id] = obj.account;
      return map;
    }, {});

    // for each record, add the accountName associated with acc_id
    const balances = await this.rawBalances?.map((item) => {
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
