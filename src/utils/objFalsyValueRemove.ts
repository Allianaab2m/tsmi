/**
 *
 * @param object - removal object
 * @param target - target falsy value array
 * @returns - removed object
 */

const objFalsyValueRemove = (
  object: Record<string, any>,
  target: (undefined | null | 0 | "" | false)[],
) => {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !target.includes(object[key])),
  );
};

export default objFalsyValueRemove;
