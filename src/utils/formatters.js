export const formatNumberDivisor = (num, divisor) => {
  return new Intl.NumberFormat("en-US", { style: "decimal", maximumFractionDigits: 2 }).format(
    num / divisor
  );
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-US", { style: "decimal", maximumFractionDigits: 2 }).format(num);
};
