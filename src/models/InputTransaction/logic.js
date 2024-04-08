import store from "./store";
import global from "../../store";

export default class Logic {
  constructor() {
    this.setWarn = global((s) => s.setWarn);
    this.num = store((s) => s.num);
  }

  handleInput(e) {
    const input = e.target.value;

    const pattern =
      /^-?$|^-?0$|^-?0\.$|^-?[1-9]+$|^-?[1-9][0-9]+$|^-?[1-9]+\.$|^-?[1-9]+\.[0-9]{1,5}$|^-?0\.[0-9]{1,5}$/;
    if (pattern.test(input)) {
      setNum(input);
    }

    const zeroPattern = /^-?0\.0+$|^-?0\.$|^-?0$|^-?[1-9]+\.$/;
    if (zeroPattern.test(input)) {
      setWarn({ zero: true });
    } else {
      setWarn({ zero: false });
    }

    const emptyPattern = /^-?$/;
    if (emptyPattern.test(input)) {
      setWarn({ empty: true });
    } else {
      setWarn({ empty: false });
    }
  }
}
