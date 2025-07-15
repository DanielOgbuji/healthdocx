// Helper function to update nested object
export const updateNested = (
	obj: Record<string, unknown>,
	path: string[],
	value: unknown
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

// Add this to dynamicFormUtils.ts
export const getNestedValue = (
  obj: Record<string, unknown>,
  path: string[]
): unknown => {
  let current: unknown = obj;
  
  for (const key of path) {
    if (typeof current !== 'object' || current === null || Array.isArray(current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  
  return current;
};

export const removeNested = (
	obj: Record<string, unknown>,
	path: string[]
): Record<string, unknown> => {
	if (path.length === 0) return obj;

	const newObj = { ...obj };
	let current: Record<string, unknown> = newObj;

	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i];
		if (typeof current[key] === "object" && current[key] !== null) {
			current = current[key] as Record<string, unknown>;
		} else {
			return newObj;
		}
	}

	const finalKey = path[path.length - 1];
	delete current[finalKey];

	return newObj;
};

export const insertNested = (
	obj: Record<string, unknown>,
	path: string[],
	key: string,
	value: unknown,
	index: number
) => {
  if (path.length === 0) {
    const newObj = { ...obj };
    const entries = Object.entries(newObj);
    
    // Handle negative index (insert at end)
    const insertAt = index >= 0 ? index : entries.length + index + 1;
    entries.splice(insertAt, 0, [key, value]);
    
    return Object.fromEntries(entries);
  }

	const [head, ...rest] = path;
	if (rest.length === 0) {
		if (
			obj[head] &&
			typeof obj[head] === "object" &&
			!Array.isArray(obj[head])
		) {
			const targetObj = obj[head] as Record<string, unknown>;
			const entries = Object.entries(targetObj);
			entries.splice(index, 0, [key, value]);
			obj[head] = Object.fromEntries(entries);
		} else {
			// If the target is not an object, we can't insert into it.
			// Implement more robust error handling later
			console.warn("Attempted to insert into a non-object target.");
		}
		return obj;
	}

	if (obj[head] && typeof obj[head] === "object") {
		insertNested(obj[head] as Record<string, unknown>, rest, key, value, index);
	} else {
		// Create the nested path if it doesn't exist
		obj[head] = {};
		insertNested(obj[head] as Record<string, unknown>, rest, key, value, index);
	}
	return obj;
};

export const formatLabel = (label: string): string =>
	label
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
		.trim()
		.replace(/^./, (str) => str.toUpperCase());

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
			const newKey = stringToFormat;

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
