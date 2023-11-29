function returnEmptyFieldsTuple(input: Record<string, any>) {
	const fieldValuesTuples: [string, boolean][] = Object.entries(input).map(
		([field, value]) => [field, value === ""],
	);

	return fieldValuesTuples.filter(([_, value]) => value === true);
}

function removeUndefinedAndNullValues<T>(value?: T | null): value is T {
	return value !== undefined && value !== null;
}

type FilterFieldsFromObjectInput<
	Obj extends Record<string | number | symbol, any> = Record<
		string | symbol | number,
		any
	>,
> = {
	object: Obj;
	fieldsToFilter: Array<keyof Obj>;
};
/**
 * Pure function: Removes specified fields from an object and returns a new object with the remaining fields.
 */
function filterFieldsFromObject<
	Obj extends Record<string | number | symbol, any> = Record<
		string | symbol | number,
		any
	>,
	Keys extends keyof Obj = keyof Obj,
>({
	object,
	fieldsToFilter,
}: FilterFieldsFromObjectInput<Obj>): Omit<Obj, Keys> {
	return Object.entries(object).reduce((obj, [key, value]) => {
		if (fieldsToFilter.includes(key)) {
			return obj;
		}
		obj[key] = value;

		return obj;
	}, Object.create(null));
}

export {
	returnEmptyFieldsTuple,
	removeUndefinedAndNullValues,
	filterFieldsFromObject,
};
