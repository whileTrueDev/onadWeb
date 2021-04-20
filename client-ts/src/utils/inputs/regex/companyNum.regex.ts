const companyNumRegex = /^[0-9]{7,8}$/;
export default companyNumRegex;

export function checkCompanyNum(target: string): boolean {
  return companyNumRegex.test(target);
}
