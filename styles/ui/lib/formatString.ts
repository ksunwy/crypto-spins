export function formatString(input: string): string {
    if (input.length > 8) {
      return `${input.slice(0, 5)}...${input.slice(-3)}`;
    }
    return input;
  }