
// Using the Box-Muller transform to generate normally distributed random numbers.
function random_normal_bm(mean: number, stddev: number): number {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    const num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    
    return num * stddev + mean;
}

/**
 * Generates an array of numbers following a Gaussian (normal) distribution.
 * @param mean - The desired mean (μ) of the distribution.
 * @param stdDev - The desired standard deviation (σ) of the distribution.
 * @param count - The number of data points to generate.
 * @returns An array of numbers.
 */
export function generateGaussianData(mean: number, stdDev: number, count: number): number[] {
    const data: number[] = [];
    for (let i = 0; i < count; i++) {
        data.push(random_normal_bm(mean, stdDev));
    }
    return data;
}

    