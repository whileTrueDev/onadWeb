// Parse search parpameter
export default function parseParams(search: string): Record<string, any> {
  const result = {};
  search.substr(1).split('&').map((splited) => {
    const [key, value] = splited.split('=');
    return Object.assign(result, {
      [key]: decodeURI(value),
    });
  });
  return result;
}
