import { useEffect } from "react";
import SelectAccount from "./models/SelectAccount/view";
import AccountBalance from "./models/AccountBalance/view";

function AddTransaction() {
  // useEffect(() => {
  //   console.log(warn);
  // }, [warn]);

  return (
    <>
      <SelectAccount />
      <AccountBalance />
    </>
  );
}

export default AddTransaction;
