import React from "react";
import { useEffect } from "react";
import LogicClass from "./logic";
import store from "./store";
import globalStore from "../../store";

export default function AccountBalance() {
  const logic = new LogicClass();
  const { balances } = store();
  const { submission } = globalStore();

  useEffect(() => {
    logic.run();
  }, []);

  useEffect(() => {
    logic.run();
  }, [submission]);

  return (
    <>
      {balances.length > 0 &&
        balances.map((item, index) => (
          <div key={index}>
            <p>
              {item.account}: {item.balance}
            </p>
          </div>
        ))}
    </>
  );
}
