const ISO_DATE_SEPARATOR = '-';

export function formatIsoToBrDate(isoDate: string): string {
  const [year, month, day] = isoDate.split(ISO_DATE_SEPARATOR);
  return `${day}/${month}/${year}`;
}
