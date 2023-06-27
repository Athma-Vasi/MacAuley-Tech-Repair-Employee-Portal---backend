function returnEmptyFieldsTuple(input: Record<string, string | NativeDate>) {
  const fieldValuesTuples: [string, boolean][] = Object.entries(input).map(([field, value]) => [
    field,
    value === '',
  ]);

  return fieldValuesTuples.filter(([_, value]) => value === true);
}

export { returnEmptyFieldsTuple };
