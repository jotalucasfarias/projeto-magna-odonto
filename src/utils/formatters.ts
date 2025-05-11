export function formatDateToBrazilian(dateString: string) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

// Format creation date
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatMessageDate(timestamp: any) {
  if (!timestamp) return "--";
  
  // Convert to Brazilian date with time
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  } catch (e) {
    return "erro: " + e;
  }
}
