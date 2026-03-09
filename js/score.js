/**
 * Numbers of decimal digits to round to
 */
const scale = 3;

/**
 * Calculates the total "weight" of the list.
 * This is the denominator for your 10,000 point formula.
 * @param {Array} list The array of levels (filtered to remove non-levels)
 * @returns {Number}
 */
function getRawSum(totalLevels) {
    let sum = 0;
    const k = 1.18;
    const N = totalLevels;

    for (let i = 1; i <= N; i++) {
        // Your formula: 3 + 297 * ((N-i)/(N-1))^k
        // We use Math.max(1, N-1) to prevent division by zero if there's only 1 level
        let rawP = 3 + 297 * Math.pow((N - i) / Math.max(1, N - 1), k);
        sum += rawP;
    }
    return sum;
}

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list (r)
 * @param {Number} totalLevels Total number of valid levels on the list (N)
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, totalLevels, percent, minPercent) {
    // If the player hasn't reached the minimum requirement, they get 0
    if (percent < minPercent) {
        return 0;
    }

    const k = 1.18;
    const N = totalLevels;

    // 1. Calculate the Raw Points for this specific rank
    let rawScore = 3 + 297 * Math.pow((N - rank) / Math.max(1, N - 1), k);

    // 2. Calculate the Sum of all Raw Points on the list
    let rawSum = getRawSum(N);

    // 3. Normalize to 10,000 points
    // This ensures (Individual / Total) * 10,000
    let base10kScore = (rawScore / rawSum) * 10000;

    // 4. Calculate score based on percentage (Percentage Math)
    let finalScore = base10kScore *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));

    finalScore = Math.max(0, finalScore);

    // 5. Apply penalty for non-100% completions
    if (percent != 100) {
        return round(finalScore - finalScore / 3);
    }

    return Math.max(round(finalScore), 0);
}

/**
 * Standard rounding utility from the original script
 */
export function round(num) {
    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
    } else {
        var arr = ('' + num).split('e');
        var sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(
            Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
            'e-' +
            scale
        );
    }
}
