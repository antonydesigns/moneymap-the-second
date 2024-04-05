import { useEffect } from "react";
import inputStore from "./numberInput.store";
import globalStore from "./store";

function NumberInput() {
  const { num, setNum } = inputStore();
  const { warn, setWarn, currentBalance, setAfterBalance } = globalStore();
  const { info, setInfo } = globalStore();

  function handleInput(e) {
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

  useEffect(() => {
    const result = parseFloat(currentBalance) + parseFloat(num);
    if (result > 0) {
      setInfo({ finalBalance: `Your final balance will be ${result}` });
    }

    if (result < 0) {
      setInfo({
        finalBalance: `You don't have enough balance for this withdrawal`,
      });
    }
  }, [num]);

  return (
    <>
      <input type="text" value={num} onChange={handleInput} />
      <p>{!warn.empty && !warn.zero && info.finalBalance}</p>
    </>
  );
}

export default NumberInput;
