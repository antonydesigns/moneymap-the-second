import Logic from "./models/AccountBalance/logic.js";
import AddTransaction from "./AddTransaction";
import Menu from "./NumberInput";
// import store from "./store";
import store from "./models/AccountBalance/store.js";
import { useEffect } from "react";

function Home() {
  // const tester = store((s) => s.test);

  const logic = new Logic();
  console.log(logic.url);

  return <>{/*  <AddTransaction /> */}</>;
}

export default Home;
