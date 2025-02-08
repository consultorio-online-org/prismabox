export function wrapWithVarChar(input: string, size: number) {
  return `${input}.maxLength(${size})`;
}