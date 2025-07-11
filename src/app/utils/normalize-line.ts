export function normalizeLine(line: string): string {
  return (line === 'FS' || line === 'GS' || line === 'H') ? 'S' : line;
}
