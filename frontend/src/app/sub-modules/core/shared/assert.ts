export function assert(isSuccess: boolean, errorMsg: string): void {
  if (isSuccess) {
    return;
  }

  throw new Error(errorMsg);
}
