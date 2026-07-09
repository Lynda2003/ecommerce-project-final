// 1 EUR = 3.35 DT (taux approximatif)
const RATE = 3.35;

export const toDT = (priceEur) => {
  return (priceEur * RATE).toFixed(3);
};

export const formatDT = (priceEur) => {
  const dt = priceEur * RATE;
  return `${dt.toFixed(3)} DT`;
};