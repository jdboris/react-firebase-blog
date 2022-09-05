/**
 * Returns a "replacer" function to pass to `JSON.stringify` that adds a `$type` property to `object` values, so they can later be parsed as instances.
 * @param {Array.<Function>} types - An array of classes/constructors to include.
 * @return {Function} The replacer function.
 *
 * Example:
 * ```
 * JSON.stringify(article, addTypes([Date]));
 * ```
 */
export function addTypes(types) {
  let object = null;

  return (key, value) => {
    object = object || value;

    return (
      (object[key] &&
        typeof object[key] == "object" &&
        types.find((type) => type.name == object[key].constructor.name) && {
          value,
          $type: object[key].constructor.name,
        }) ||
      value
    );
  };
}

/**
 * Returns a "reviver" function to pass to `JSON.parse` that converts `object` values to instances, using their `$type` property.
 * @param {Array.<Function>} types - An array of classes/constructors to include.
 * @return {Function} The reviver function.
 *
 * Example:
 * ```
 * JSON.parse(article, parseTypes([Date]));
 * ```
 */
export function parseTypes(types) {
  return (key, value) => {
    return (
      (value &&
        typeof value == "object" &&
        value.$type &&
        new (types.find((type) => type.name == value.$type))(value.value)) ||
      value
    );
  };
}
