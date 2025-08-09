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
	const pathSegments: Record<string, unknown>[] = [newObj];

	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i];
		if (typeof current[key] === "object" && current[key] !== null && !Array.isArray(current[key])) {
			current[key] = { ...(current[key] as Record<string, unknown>) }; // Deep copy this level
			current = current[key] as Record<string, unknown>;
			pathSegments.push(current);
		} else {
			return newObj; // Path not found or not an object, return original shallow copy
		}
	}

	const finalKey = path[path.length - 1];
	delete current[finalKey]; // This now mutates the copied object at the final level

	return newObj;
};

export const insertNested = (
	obj: Record<string, unknown>,
	path: string[],
	key: string,
	value: unknown,
	index: number
): Record<string, unknown> => {
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
			const targetObj = { ...(obj[head] as Record<string, unknown>) }; // Create a new object for the target
			const entries = Object.entries(targetObj);
			const insertAt = index >= 0 ? index : entries.length + index + 1;
			entries.splice(insertAt, 0, [key, value]);
			return { ...obj, [head]: Object.fromEntries(entries) }; // Return a new object for the current level
		} else {
			console.warn(
				"Attempted to insert into a non-object target or invalid index."
			);
			return obj; // Return original object if insertion is not possible
		}
	}

	const newHeadValue: Record<string, unknown> =
		obj[head] && typeof obj[head] === "object" && !Array.isArray(obj[head])
			? insertNested(
					{ ...(obj[head] as Record<string, unknown>) },
					rest,
					key,
					value,
					index
			  ) // Recurse with a copy
			: insertNested({}, rest, key, value, index); // Create new object if path doesn't exist

	return { ...obj, [head]: newHeadValue }; // Return a new object for the current level
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
	labels: Record<string, string>,
	ocrText: string | null
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
			const pathString = currentPath.join("_");

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

	const structuredData = transform(data as JsonValue) as Record<string, unknown>;

	return {
		data: {
			structuredData: structuredData,
			ocrText: ocrText,
		},
	};
};
