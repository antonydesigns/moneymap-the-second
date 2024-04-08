import React from "react";
import axios from "axios";
import globalStore from "../../store";
import store from "./store";
import accountStore from "../AccountBalance/store";

export default function SelectAccount() {
  const { setWarn, domainName, setSubmission, submission } = globalStore();
  const { accounts, balances } = accountStore();
  const { selectedAccount, setSelectedAccount } = store();
  const { newAccount, setNewAccount } = store();
  const { addAccountField, setAddAccountField } = store();
  const { currentBalance, setCurrentBalance } = store();

  const url = "http://" + domainName + "/api/";

  function accountSelection(e) {
    const selected = e.target.value;

    if (selected == "") {
      setWarn({ noAccount: true });
    } else {
      setWarn({ noAccount: false });
    }

    setSelectedAccount(selected);
    const account = balances?.find((obj) => obj.acc_id == selected);
    setCurrentBalance(account?.balance);
  }

  async function submitNewAccount() {
    const response = await axios.post(url, {
      meta: "new_account",
      new_account: newAccount,
    });
    setAddAccountField(!addAccountField);
    setNewAccount("");
    setSubmission(!submission);
    console.log(response);
  }

  return (
    <>
      {!addAccountField && (
        <>
          <select value={selectedAccount} onChange={accountSelection}>
            <option value="">Select account...</option>
            {accounts.length != 0 &&
              balances.length > 0 &&
              accounts.map((account, index) => {
                return (
                  <option key={index} value={account.acc_id}>
                    {account.account}
                  </option>
                );
              })}
          </select>
          <button
            type="button"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              setAddAccountField(!addAccountField);
            }}
          >
            Add account
          </button>
        </>
      )}

      {addAccountField && (
        <>
          <input
            type="text"
            name="newAccount"
            value={newAccount}
            onChange={(e) => {
              setNewAccount(e.target.value);
            }}
          />
          <button
            type="button"
            style={{ marginLeft: "10px" }}
            onClick={submitNewAccount}
          >
            Add
          </button>
          <button
            type="button"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              setAddAccountField(!addAccountField);
            }}
          >
            Cancel
          </button>
        </>
      )}
    </>
  );
}
