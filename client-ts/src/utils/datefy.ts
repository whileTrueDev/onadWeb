export default function datefy(dd: Date): string {
  const year = dd.getFullYear();
  const month = `${dd.getMonth() + 1}`.padStart(2, '0');
  const day = `${dd.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}
