export function expirationDate(days = 30): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
