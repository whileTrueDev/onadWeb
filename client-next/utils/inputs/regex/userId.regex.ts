const userIdRegex = /^[a-z]+[a-z0-9]{5,14}$/g;
export default userIdRegex;

export function checkUserId(target: string): boolean {
  return userIdRegex.test(target);
}
