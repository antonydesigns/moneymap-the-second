export function countDecimalPlaces(number) {
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
