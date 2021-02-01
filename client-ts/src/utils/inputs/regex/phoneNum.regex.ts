const phoneNumRegex = /^\( [0-9]{3} \) [-] +[0-9]{3,4} [-] +[0-9]{4}$/;
export default phoneNumRegex;

export function checkPhoneNum(target: string): boolean {
  return phoneNumRegex.test(target);
}
