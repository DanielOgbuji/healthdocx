// Helper function to update nested object
export const updateNested = (
  obj: Record<string, unknown>,
  path: string[],
  value: string
): Record<string, unknown> => {
  if (path.length === 0) return obj;
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return { ...obj, [head]: value };
  }
  return {
    ...obj,
    [head]: updateNested(
      (obj[head] as Record<string, unknown>) || {},
      rest,
      value
    ),
  };
};

export const formatLabel = (label: string): string =>
  label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .trim()
    .replace(/^./, (str) => str.toUpperCase());

export const formatToCamelCase = (str: string): string => {
  const s = str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim();

  return s
    .split(" ")
    .map((word, index) => {
      if (word === "") return "";
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export const buildPayload = (
  data: Record<string, unknown>,
  labels: Record<string, string>
): Record<string, unknown> => {
  const transform = (obj: JsonValue, path: string[] = []): JsonValue => {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item, index) =>
        transform(item, [...path, String(index)])
      );
    }

    return Object.keys(obj).reduce((acc, oldKey) => {
      const currentPath = [...path, oldKey];
      const pathString = currentPath.join(".");

      const stringToFormat = labels[pathString] || oldKey;
      const newKey = formatToCamelCase(stringToFormat);

      if (newKey) {
        acc[newKey] = transform(
          (obj as { [key: string]: JsonValue })[oldKey],
          currentPath
        );
      }
      return acc;
    }, {} as { [key: string]: JsonValue });
  };

  return transform(data as JsonValue) as Record<string, unknown>;
};