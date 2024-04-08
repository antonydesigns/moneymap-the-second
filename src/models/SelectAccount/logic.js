import store from "./store";
import global from "../../store";
import axios from "axios";

export default class Logic {
  constructor() {
    this.domain = global((s) => s.domainName);
    this.url = "http://" + this.domain + "/api/";

    this.selectedAccount = store((s) => s.selectedAccount);
    this.setSelectedAccount = store((s) => s.setSelectedAccount);

    this.currentBalance = store((s) => s.currentBalance);
    this.setCurrentBalance = store((s) => s.setCurrentBalance);

    this.afterBalance = store((s) => s.afterBalance);
    this.setAfterBalance = store((s) => s.setAfterBalance);

    this.newAccount = store((s) => s.newAccount);
    this.setNewAccount = store((s) => s.setNewAccount);

    this.addAccountField = store((s) => s.addAccountField);
    this.setAddAccountField = store((s) => s.setAddAccountField);
  }

  accountSelection(e) {
    this.setSelected(e.target.value);
    const account = balances.find((obj) => obj.acc_id == e.target.value);
    this.setCurrentBalance(account.balance);
  }

  addNewAccount(e) {
    this.setNewAccount(e.target.value);
  }

  async submitNewAccount() {
    const response = await axios.post(url, {
      meta: "new_account",
      new_account: this.newAccount,
    });
    this.setAddAccountField(!addAccountField);
    this.setNewAccount("");
    console.log(response);
  }
}
