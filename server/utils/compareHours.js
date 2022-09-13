module.exports = (a, b) => {
  const firstH = a.split(":")[0];
  const firstM = a.split(":")[1];
  const secondH = b.split(":")[0];
  const secondM = b.split(":")[1];
  const firstHourD = new Date().setHours(firstH, firstM, 0);
  const secondHourD = new Date().setHours(secondH, secondM, 0);

  if (firstHourD > secondHourD) return 1;
  return -1;
};
