const passwordRegex = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^*+=-]).{8,20}$/;
export default passwordRegex;

export function checkPassword(target: string): boolean {
  return passwordRegex.test(target);
}
