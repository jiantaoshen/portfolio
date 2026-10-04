const parseList = (value: string, separator: string | RegExp) =>
  value.split(separator).map((item) => item.trim()).filter(Boolean);

export const parseCommaList = (value: string) => parseList(value, ",");
export const parseLineList = (value: string) => parseList(value, /\r?\n/);
