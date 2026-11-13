export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(Number(value));
}

export function formatDate(value: string | null): string {
  if (!value) {
    return '-';
  }

  const [year, month, day] = value.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}
