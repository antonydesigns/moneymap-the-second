export function countDecimalPlaces(number) {
  const numStr = number.toString();
  const decimalIndex = numStr.indexOf(".");
  if (decimalIndex === -1 || decimalIndex === numStr.length - 1) {
    return 0;
  }
  let count = 0;
  for (let i = decimalIndex + 1; i < numStr.length; i++) {
    if (numStr[i] !== "0") {
      count++;
    }
  }
  return count;
}
