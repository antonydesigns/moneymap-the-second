import { useEffect } from "react";
import axios from "axios";
import store from "./store";
import numberInputStore from "./numberInput.store";
import { sortBy } from "lodash";
import NumberInput from "./NumberInput";
import {
  loadAccountNames,
  loadAccountBalances,
  renameAccountIDs,
  prettifyAccountBalances,
  countDecimalPlaces,
} from "./accountBalance.logic";

function AddTransaction() {
  const { domainName } = store();
  const { rawBalances, setRawBalances } = store();
  const { accounts, setAccounts } = store();
  const { currentBalance, setCurrentBalance } = store();
  const { afterBalance, setAfterBalance } = store();
  const { balances, setBalances } = store();
  const { selected, setSelected } = store();
  const { num } = numberInputStore();
  const { addAccountON, setAddAccountON } = store();
  const { newAccount, setNewAccount } = store();
  const { stateChange, setStateChange } = store();
  const { warn, setWarn } = store();

  // On page load, load all accounts
  async function loadAccounts() {
    const response = await axios.post(url, { meta: "load_accounts" });
    const accounts = response.data;
    setAccounts(accounts);
  }

  async function loadCheckBalances() {
    const response = await axios.post(url, { meta: "check_balances" });
    setRawBalances(response.data);
  }

  // async function renameAccounts() {
  //   // map out acc_id to its accountName
  //   const accountNames = accounts.reduce((map, obj) => {
  //     map[obj.acc_id] = obj.account;
  //     return map;
  //   }, {});

  //   // for each transaction, add the accountName associated with acc_id
  //   const balances = rawBalances.map((bal) => {
  //     const account = accountNames[bal.acc_id];
  //     const balance = parseFloat(bal.balance);

  //     // truncate trailing zeroes in the balance
  //     const decimalPlace = countDecimalPlaces(bal.balance);
  //     return {
  //       ...bal,
  //       account: account || null,
  //       balance: balance.toFixed(decimalPlace),
  //     };
  //   });
  //   const balances_sorted = sortBy(balances, "account");
  //   setBalances(balances_sorted);
  // }

  useEffect(() => {
    loadAccountNames();
    loadAccountBalances();
  }, []);

  useEffect(() => {
    renameAccountIDs();
  }, [rawBalances, accounts]);

  useEffect(() => {
    // logic.prettifyAccountBalances();
  }, [balances]);

  // useEffect(() => {
  //   loadAccounts();
  //   loadCheckBalances();
  //   renameAccounts();
  // }, [stateChange]); // Whenever a marked state changes.

  // Prepare url for axios
  const url = "http://" + domainName + "/api/";

  // Account select
  function accountSelection(e) {
    setSelected(e.target.value);
    const account = balances.find((obj) => obj.acc_id == e.target.value);
    setCurrentBalance(account.balance);
  }

  // Add account
  function handleNewAccount(e) {
    setNewAccount(e.target.value);
  }

  // Submit new account
  async function submitNewAccount() {
    const response = await axios.post(url, {
      meta: "new_account",
      new_account: newAccount,
    });
    setAddAccountON(!addAccountON);
    setNewAccount("");
    setStateChange(!stateChange);
    console.log(response);
  }

  // Submit form
  async function handleSubmit(e) {
    e.preventDefault();

    // reset inputs
    setSelected("");

    // send to API via axios
    const response = await axios.post(url, {
      acc_id: selected,
      add: num,
      meta: "input",
    });
    console.log(response);
    setStateChange(!stateChange);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p>
          <strong>Account:</strong>
        </p>
        {!addAccountON && (
          <>
            <select value={selected} onChange={accountSelection}>
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
                setAddAccountON(!addAccountON);
              }}
            >
              Add account
            </button>
          </>
        )}
        {addAccountON && (
          <>
            <input
              type="text"
              name="newAccount"
              value={newAccount}
              onChange={handleNewAccount}
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
                setAddAccountON(!addAccountON);
              }}
            >
              Cancel
            </button>
          </>
        )}

        {selected != "" && (
          <>
            <p>
              <strong>Add:</strong>
            </p>
            <NumberInput />
            <br />
            <br />
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={Object.values(warn).some((val) => val)}
            >
              Submit
            </button>
          </>
        )}
      </form>
      <div id="balances">
        <p>
          <strong>Your account balances:</strong>
        </p>
        {balances.length > 0 &&
          balances.map((account) => (
            <div key={account.acc_id}>
              <p>
                {account.account}: {account.balance}
              </p>
            </div>
          ))}
      </div>
    </>
  );
}

export default AddTransaction;
