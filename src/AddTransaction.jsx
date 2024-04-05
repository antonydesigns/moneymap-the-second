import { useEffect } from "react";
import axios from "axios";
import store from "./store";
import { sortBy } from "lodash";
import InputNumber from "react-input-number";

function AddTransaction() {
  const { domainName } = store();
  const { rawBalances, setRawBalances } = store();
  const { accounts, setAccounts } = store();
  const { currentBalance, setCurrentBalance } = store();
  const { afterBalance, setAfterBalance } = store();
  const { balances, setBalances } = store();
  const { selected, setSelected } = store();
  const { add, setAdd } = store();
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

  function countDecimalPlaces(number) {
    // Convert the number to a string to handle decimal places
    const numStr = number.toString();
    // Find the index of the decimal point
    const decimalIndex = numStr.indexOf(".");
    // If there is no decimal point or the decimal point is at the end of the string, return 0
    if (decimalIndex === -1 || decimalIndex === numStr.length - 1) {
      return 0;
    }
    // Otherwise, count the number of non-zero decimal places
    let count = 0;
    for (let i = decimalIndex + 1; i < numStr.length; i++) {
      if (numStr[i] !== "0") {
        count++;
      }
    }
    return count;
  }

  async function renameAccounts() {
    // map out acc_id to its accountName
    const accountNames = accounts.reduce((map, obj) => {
      map[obj.acc_id] = obj.account;
      return map;
    }, {});

    // for each transaction, add the accountName assoc with acc_id
    const balances = rawBalances.map((bal) => {
      const account = accountNames[bal.acc_id];
      const balance = parseFloat(bal.balance);

      // truncate trailing zeroes in the balance
      const decimalPlace = countDecimalPlaces(bal.balance);
      return {
        ...bal,
        account: account || null,
        balance: balance.toFixed(decimalPlace),
      };
    });
    const balances_sorted = sortBy(balances, "account");
    setBalances(balances_sorted);
  }

  useEffect(() => {
    loadAccounts();
    loadCheckBalances();
    renameAccounts();
  }, []);

  useEffect(() => {
    loadAccounts();
    loadCheckBalances();
    renameAccounts();
  }, [stateChange]); // Whenever a marked state changes.

  useEffect(() => {
    renameAccounts();
  }, [rawBalances, accounts]);

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
  }

  // Money "Change" field

  function handleChange(e) {
    const input = e.target.value;
    const pattern = /^-?\d+(\.\d{1,5})?$/;

    if (!pattern.test(input)) return;

    if (input.trim() === "") {
      setWarn({ empty_input_add: true });
    } else {
      setWarn({ empty_input_add: false });
    }

    setAdd(input);
  }

  useEffect(() => {
    //console.log(warn);
  }, [add]);

  // useEffect(() => {
  //   console.log(add);

  //   if (add === "") {
  //     setWarn({ empty_input_add: true });
  //   } else {
  //     setWarn({ empty_input_add: false });
  //   }

  //   const result = parseFloat(currentBalance) + add;
  //   setAfterBalance(result);
  //   if (result < 0) {
  //     setWarn({ overdraft: true });
  //   } else {
  //     setWarn({ overdraft: false });
  //   }
  // }, [add]);

  // Submit form
  async function handleSubmit(e) {
    e.preventDefault();

    // reset inputs
    setSelected("");
    setAdd("");

    // send to API via axios
    await axios.post(url, {
      acc_id: selected,
      add: add,
      meta: "input",
    });
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
            <input type="text" name="add" value={add} onChange={handleChange} />
            {/*  <InputNumber value={add} name="add" onChange={setAdd} /> */}
            <br />
            <br />
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={warn.overdraft || warn.empty_input_add}
            >
              Submit
            </button>
            {warn.overdraft && (
              <span style={{ color: "red", paddingLeft: "10px" }}>
                Your balance will be negative. Try withdrawing less :)
              </span>
            )}
            {!warn.overdraft && add != "" && typeof add === "number" && (
              <span style={{ paddingLeft: "10px" }}>
                Your final balance will be {afterBalance}.
              </span>
            )}
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
