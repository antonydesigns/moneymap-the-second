import store from "./store";

export default class Logic {
  constructor() {
    this.state = store((s) => s.state);
  }
}
