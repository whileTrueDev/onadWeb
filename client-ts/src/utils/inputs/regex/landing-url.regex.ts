const landingUrlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
export default landingUrlRegex;

export function checkLandingUrl(target: string): boolean {
  return landingUrlRegex.test(target);
}
