// Password managers (notably 1Password's inline menu) can fill an email field
// with *every* matching address at once, joined by a space — e.g.
// "dev@wynsan.com jiratnim@gmail.com" — in a single input event. A real email
// address never contains whitespace, so we keep only the first token, which is
// the account the user selected.
export function firstAutofilledEmail(value: string): string {
  const [first] = value.trim().split(/\s+/);
  return first ?? "";
}
