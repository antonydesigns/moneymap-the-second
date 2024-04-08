import store from "./store";

export default class Logic {
  constructor() {
    this.transactionSubmitted = store((s) => s.transactionSubmitted);
    this.setTrxSubmitted = store((s) => s.setTrxSubmitted);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const response = await axios.post(url, {
      acc_id: selected,
      add: num,
      meta: "input",
    });
    console.log(response);
  }
}
