function returnEmptyFieldsTuple(input: Record<string, any>) {
  const fieldValuesTuples: [string, boolean][] = Object.entries(input).map(([field, value]) => [
    field,
    value === '',
  ]);

  return fieldValuesTuples.filter(([_, value]) => value === true);
}

function removeUndefinedAndNullValues<T>(value?: T | null): value is T {
  return value !== undefined && value !== null;
}

export { returnEmptyFieldsTuple, removeUndefinedAndNullValues };
