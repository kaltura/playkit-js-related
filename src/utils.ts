/**
 * Format seconds input into time format
 *
 * @param {number} input number of seconds
 * @returns {string} formatted time string
 */
function toHHMMSS(input: number): string {
  const padZeros = (number: number) => `${number < 10 ? "0" : ""}${number}`;

  const seconds = input % 60;
  const SS = padZeros(seconds);
  input -= seconds;

  const minutes = input % 3600;
  const MM = `${padZeros(minutes / 60)}:`;
  input -= minutes;

  const hours = input / 3600;
  const HH = hours ? `${padZeros(hours)}:` : "";

  return `${HH}${MM}${SS}`;
}

export { toHHMMSS };
