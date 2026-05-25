let counter = 0;

export function generateId(prefix = 'mc'): string {
  counter++;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}_${timestamp}_${random}_${counter}`;
}

export function resetIdCounter(): void {
  counter = 0;
}
