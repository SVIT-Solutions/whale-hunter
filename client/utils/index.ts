export function hexToRgba(hexColor: string, alpha: number): string {
  if (!/^#[0-9A-F]{6}$/i.test(hexColor)) {
    return hexColor;
  }

  const red = parseInt(hexColor.slice(1, 3), 16);
  const green = parseInt(hexColor.slice(3, 5), 16);
  const blue = parseInt(hexColor.slice(5, 7), 16);

  if (alpha < 0 || alpha > 1) {
    return hexColor;
  }

  const rgbaColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

  return rgbaColor;
}

export function formatNumber(value: number): string {
  const absValue = Math.abs(value);

  if (absValue < 1) {
    return value.toString();
  }

  const prefixes = ['', 'K', 'M', 'B', 'T'];
  const exp = Math.floor(Math.log10(absValue) / 3);

  let prefix;
  if (exp >= prefixes.length) {
    const largeExp = Math.floor(exp / prefixes.length);
    prefix = prefixes[prefixes.length - 1].repeat(largeExp);
  } else {
    prefix = prefixes[exp];
  }

  const scaledValue = value / Math.pow(10, exp * 3);
  const roundedValue = scaledValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  return `${roundedValue}${prefix}`;
}

interface FetchWithRateLimitParams {
  fetchFunction: () => Promise<any>;
  values: any[];
  valueKeyName: string;
  mockVariables: object;
  rateLimit?: number;
  interval?: number;
}

export const fetchWithRateLimit = async ({
  fetchFunction,
  values,
  valueKeyName,
  mockVariables,
  rateLimit = 5,
  interval = 1,
}: FetchWithRateLimitParams) => {
  const results = [];
  for (let i = 0; i < values.length; i += rateLimit) {
    const batch = [];
    for (let j = i; j < i + rateLimit && j < values.length; j++) {
      batch.push(fetchFunction({ ...mockVariables, [valueKeyName]: values[j] }));
    }
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
    if (i + rateLimit < values.length) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
  return results;
};
