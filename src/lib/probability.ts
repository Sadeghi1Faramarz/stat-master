
/**
 * Calculates the factorial of a non-negative integer.
 * Uses an iterative approach to prevent stack overflow with large numbers.
 * @param n The non-negative integer.
 * @returns The factorial of n. Returns 1 for n=0.
 */
export const factorial = (n: number): number => {
  if (n < 0) {
    return NaN; // Factorial is not defined for negative numbers
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  // Use BigInt for intermediate calculations to avoid overflow for n > 21
  let result = BigInt(1);
  for (let i = 2; i <= n; i++) {
    result *= BigInt(i);
  }
  // Note: This might return Infinity for very large n if the result exceeds Number.MAX_SAFE_INTEGER
  return Number(result);
};

/**
 * Calculates the number of permutations (arrangements).
 * P(n, r) = n! / (n - r)!
 * @param n The total number of items.
 * @param r The number of items to arrange.
 * @returns The number of permutations.
 */
export const permutation = (n: number, r: number): number => {
  if (n < r || n < 0 || r < 0) {
    return 0;
  }
  // Optimized calculation to avoid large factorials
  let result = BigInt(1);
  for (let i = n; i > n - r; i--) {
    result *= BigInt(i);
  }
  return Number(result);
};


/**
 * Calculates the number of combinations (selections).
 * C(n, r) = n! / (r! * (n - r)!)
 * @param n The total number of items.
 * @param r The number of items to choose.
 * @returns The number of combinations.
 */
export const combination = (n: number, r: number): number => {
  if (n < r || n < 0 || r < 0) {
    return 0;
  }
  if (r === 0 || r === n) {
    return 1;
  }
  // Use the symmetry property C(n, r) = C(n, n-r) for optimization
  if (r > n / 2) {
    r = n - r;
  }
  
  // Calculate C(n,r) = (n * (n-1) * ... * (n-r+1)) / r!
  let result = BigInt(1);
  for (let i = 1; i <= r; i++) {
    result = result * BigInt(n - i + 1) / BigInt(i);
  }
  return Number(result);
};

/**
 * Generates all permutations of size r from a set of items.
 * @param items The array of items to choose from.
 * @param r The size of each permutation.
 * @returns An array of arrays, where each inner array is a permutation.
 */
export const generatePermutations = <T>(items: T[], r: number): T[][] => {
    if (r === 0) return [[]];
    if (r > items.length) return [];

    const result: T[][] = [];

    function permute(currentPerm: T[], remainingItems: T[]) {
        if (currentPerm.length === r) {
            result.push(currentPerm);
            return;
        }

        for (let i = 0; i < remainingItems.length; i++) {
            const nextItem = remainingItems[i];
            const newPerm = [...currentPerm, nextItem];
            const newRemaining = [...remainingItems.slice(0, i), ...remainingItems.slice(i + 1)];
            permute(newPerm, newRemaining);
        }
    }

    permute([], items);
    return result;
};


/**
 * Generates all combinations of size r from a set of items.
 * @param items The array of items to choose from.
 * @param r The size of each combination.
 * @returns An array of arrays, where each inner array is a combination.
 */
export const generateCombinations = <T>(items: T[], r: number): T[][] => {
    if (r < 0 || r > items.length) return [];
    if (r === 0) return [[]];

    const result: T[][] = [];

    function combine(startIndex: number, currentCombo: T[]) {
        if (currentCombo.length === r) {
            result.push(currentCombo);
            return;
        }

        if (startIndex === items.length) return;

        // Include items[startIndex]
        combine(startIndex + 1, [...currentCombo, items[startIndex]]);

        // Exclude items[startIndex]
        combine(startIndex + 1, currentCombo);
    }
    
    const recursiveCombine = (startIndex: number, currentCombo: T[]) => {
      if (currentCombo.length === r) {
        result.push(currentCombo);
        return;
      }
      if (startIndex === items.length) return;

      for (let i = startIndex; i < items.length; i++) {
        recursiveCombine(i + 1, [...currentCombo, items[i]]);
      }
    }
    
    recursiveCombine(0, []);
    return result;
};
