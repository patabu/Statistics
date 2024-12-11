const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let areProbabilitiesGenerated = false;

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 200;

const graphPositions = {
    xStart: canvas.width * 0.05,
    xEnd: canvas.width * 0.95,
    yStart: canvas.height * 0.05,
    yEnd: canvas.height * 0.9
}

const graph = {
    width: graphPositions.xEnd - graphPositions.xStart,
    height: graphPositions.yEnd - graphPositions.yStart
}

function clearChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

drawChartAxis();

function drawChartAxis() {
    ctx.lineWidth = 2;

    // * Draw right Y-axis
    ctx.beginPath();
    ctx.moveTo(graphPositions.xEnd, graphPositions.yEnd);
    ctx.lineTo(graphPositions.xEnd, graphPositions.yStart);
    ctx.stroke();

    // * Draw left Y-axis
    ctx.beginPath();
    ctx.moveTo(graphPositions.xStart, graphPositions.yStart);
    ctx.lineTo(graphPositions.xStart, graphPositions.yEnd);
    ctx.stroke();

    // * Draw X-axis
    ctx.beginPath();
    ctx.moveTo(graphPositions.xStart, graphPositions.yEnd);
    ctx.lineTo(graphPositions.xEnd, graphPositions.yEnd);
    ctx.stroke();

    // * Draw legend 20x5 rect
    ctx.fillStyle = "#329e11";
    ctx.fillRect(
        ((graphPositions.xEnd - graphPositions.xStart) / 2) + graphPositions.xStart - 150,
        graphPositions.yStart - 30,
        60,
        10
    );
    ctx.fill();

    ctx.font = "14px serif";
    ctx.fillStyle = "#000000";
    ctx.fillText('Empiric', ((graphPositions.xEnd - graphPositions.xStart) / 2) + graphPositions.xStart - 80, graphPositions.yStart - 20)

    ctx.fillStyle = "#bec748";
    ctx.fillRect(
        ((graphPositions.xEnd - graphPositions.xStart) / 2) + graphPositions.xStart + 50,
        graphPositions.yStart - 30,
        60,
        10
    );
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.fillText('Theoretical', ((graphPositions.xEnd - graphPositions.xStart) / 2) + graphPositions.xStart + 120, graphPositions.yStart - 20);
}

function drawChartLines(probabilityIntervals) {
    const intervalWidth = (graphPositions.xEnd - graphPositions.xStart) / probabilityIntervals.length;

    const maxDistribution = Math.max(...(probabilityIntervals.map(probabilityData => [probabilityData.empiricDistribution, probabilityData.theoreticalDistribution])).flat());    
    const distributionPortionCalculatedOnMax = maxDistribution / 10;
    
    const graphHeight = graphPositions.yEnd - graphPositions.yStart;
    const heightSpacePerDistribution = graphHeight / 10;

    const paddingBetweenBars = intervalWidth / 20;
    const distributionBarWidth = (intervalWidth - (3 * paddingBetweenBars)) / 2;

    for (let distributionIndex = 0; distributionIndex < probabilityIntervals.length; distributionIndex++) {
        // * Empiric
        
        ctx.beginPath();
        ctx.fillStyle = "#329e11"; 
        ctx.rect(
            (graphPositions.xStart + (distributionIndex * intervalWidth)) + paddingBetweenBars,
            graphPositions.yEnd - 1,
            distributionBarWidth,
            -((probabilityIntervals[distributionIndex].empiricDistribution / maxDistribution) * graphHeight)
        );
        ctx.fill();

        // * Theoretical
        ctx.fillStyle = "#bec748";
        ctx.beginPath();
        ctx.rect(
            (graphPositions.xStart + (distributionIndex * intervalWidth)) + (2 * paddingBetweenBars) + distributionBarWidth,
            graphPositions.yEnd - 1,
            distributionBarWidth,
            -((probabilityIntervals[distributionIndex].theoreticalDistribution / maxDistribution) * graphHeight)
        );
        ctx.fill();
        
        ctx.fillStyle = "#000000";
        ctx.fillText(`(${probabilityIntervals[distributionIndex].startProbability.toFixed(2)}, ${probabilityIntervals[distributionIndex].endProbability.toFixed(2)}]`, (graphPositions.xStart + (distributionIndex * intervalWidth)), graphPositions.yEnd + 15)
    }

    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";

    ctx.strokeStyle = "#9ca0a6";
    ctx.lineWidth = .5;
    for (let indexProbability = 1; indexProbability < probabilityIntervals.length; indexProbability++) {
        ctx.beginPath();
        ctx.moveTo(graphPositions.xStart + (intervalWidth * indexProbability), graphPositions.yStart);
        ctx.lineTo(graphPositions.xStart + (intervalWidth * indexProbability), graphPositions.yEnd);
        ctx.stroke();
    }

    for (let horizontalRowIndex = 0; horizontalRowIndex < 10; horizontalRowIndex++) {
        const y = graphPositions.yStart + (heightSpacePerDistribution * horizontalRowIndex)
        ctx.beginPath();
        ctx.moveTo(graphPositions.xStart, y);
        ctx.lineTo(graphPositions.xEnd, y);
        ctx.stroke();
        ctx.fillText((maxDistribution - (distributionPortionCalculatedOnMax * horizontalRowIndex)).toFixed(2), graphPositions.xStart - 35, y);
    }

}

function drawMeanAndVariance(probabilityIntervals, sampledIntervals, meanOfCorrectedVarianceDistribution, varianceOfCorrectedVarianceDistribution, meanOfNotCorrectedVariancesDistribution, varianceOfNotCorrectedVariancesDistribution) {
    const { mean: theoreticalMean, variance: theoreticalVariance} = calculateTheoreticalMeanVariance(probabilityIntervals);
    const { mean: empiricMean, variance: empiricVariance, means, variances } = calculateMeanVarianceAllSteps(sampledIntervals);
    const meanOfMeans = means.reduce((sum, val) => sum + val, 0) / means.length; // * Calcolo della media delle medie
    const meanOfVariances = variances.reduce((sum, val) => sum + val, 0) / variances.length; // * Calcolo della media delle varianze
    ctx.fillStyle = "#000000";
    ctx.fillText('Theoretical Mean: ' + theoreticalMean.toFixed(3), graphPositions.xStart, graphPositions.yEnd + 40);
    ctx.fillText('Theoretical Variance: ' + theoreticalVariance.toFixed(3), graphPositions.xStart, graphPositions.yEnd + 60);

    ctx.fillText('Empiric Mean: ' + empiricMean.toFixed(3), graphPositions.xStart + 200, graphPositions.yEnd + 40);
    ctx.fillText('Empiric Variance: ' + empiricVariance.toFixed(3), graphPositions.xStart + 200, graphPositions.yEnd + 60);

    ctx.fillText('Mean of means: ' + meanOfMeans.toFixed(3), graphPositions.xStart + 400, graphPositions.yEnd + 40);
    ctx.fillText('Mean of variances: ' + meanOfVariances.toFixed(3), graphPositions.xStart + 400, graphPositions.yEnd + 60);

    ctx.fillText('Mean of C. variances distribution: ' + meanOfCorrectedVarianceDistribution.toFixed(3), graphPositions.xStart + 600, graphPositions.yEnd + 40);
    ctx.fillText('Variance of C. variances distribution: ' + varianceOfCorrectedVarianceDistribution.toFixed(3), graphPositions.xStart + 600, graphPositions.yEnd + 60);

    ctx.fillText('Mean of N.C. variances distribution: ' + meanOfNotCorrectedVariancesDistribution.toFixed(3), graphPositions.xStart + 850, graphPositions.yEnd + 40);
    ctx.fillText('Variance of N.C. variances distribution: ' + varianceOfNotCorrectedVariancesDistribution.toFixed(3), graphPositions.xStart + 850, graphPositions.yEnd + 60);
    
}

function onExecute() {
    try {
        const { probabilityIntervals, numberOfSamples } = getInputData();
        clearChart();
        drawChartAxis();
        const sampledIntervals = [];
        const correctedSampledVariances = [];
        const notCorrectedSampledVariances = [];

        for (let sample = 1; sample <= numberOfSamples; sample++) {
            const probability = toFixedNumber(Math.random());
            for (let probabilityIntervalIndex = 0; probabilityIntervalIndex < probabilityIntervals.length; probabilityIntervalIndex++) {
                const probabilityInterval = probabilityIntervals[probabilityIntervalIndex]
                if (probability > probabilityInterval.startProbability && probability <= probabilityInterval.endProbability) {
                    probabilityInterval.empiricDistribution++;
                    sampledIntervals.push(probabilityInterval.intervalNumber);
                }
            }
            correctedSampledVariances.push(calculateVariance(sampledIntervals));
            notCorrectedSampledVariances.push(calculateVariance(sampledIntervals, false));
        }       

        const correctedVarianceDistribution = calculateVarianceDistribution(correctedSampledVariances);
        const notCorrectedVarianceDistribution = calculateVarianceDistribution(notCorrectedSampledVariances);
        
        const { meanOfVariances: meanOfCorrectedVariances, varianceOfVariances: varianceOfCorrectedVariances } = calculateMeanAndVarianceOfDistribution(correctedVarianceDistribution);
        const { meanOfVariances: meanOfNotCorrectedVariances, varianceOfVariances: varianceOfNotCorrectedVariances } = calculateMeanAndVarianceOfDistribution(notCorrectedVarianceDistribution);

        drawChartLines(probabilityIntervals, sampledIntervals);
        drawMeanAndVariance(probabilityIntervals, sampledIntervals, meanOfCorrectedVariances, varianceOfCorrectedVariances, meanOfNotCorrectedVariances, varianceOfNotCorrectedVariances);
    } catch (error) {
        console.log(error);
        window.alert(error);
    }
}

// Funzione per calcolare la media e la varianza della distribuzione delle varianze
function calculateMeanAndVarianceOfDistribution(varianceDistribution) {
    const variances = Object.keys(varianceDistribution).map(Number); // Otteniamo le varianze uniche
    const frequencies = Object.values(varianceDistribution); // Frequenze di ogni varianza

    // Media delle varianze (pondere per le frequenze)
    const meanOfVariances = variances.reduce((sum, variance, index) => sum + variance * frequencies[index], 0) / frequencies.reduce((sum, frequency) => sum + frequency, 0);

    // Varianza delle varianze (utilizzando la formula della varianza)
    const varianceOfVariances = variances.reduce((sum, variance, index) => sum + Math.pow(variance - meanOfVariances, 2) * frequencies[index], 0) / frequencies.reduce((sum, frequency) => sum + frequency, 0);

    return {
        meanOfVariances,
        varianceOfVariances
    };
}


function calculateVariance(sample, corrected = true) {
    if (corrected && sample.length < 2) return 0;
    let mean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
    let sumSquares = sample.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0);
    return corrected ? sumSquares / (sample.length - 1) : sumSquares / sample.length;
}

function calculateVarianceDistribution(sampleVariances) {
    const varianceDistribution = {};

    sampleVariances.forEach(variance => {
        if (varianceDistribution[variance]) varianceDistribution[variance]++;
        else varianceDistribution[variance] = 1;
    });

    return varianceDistribution;
}


function generateProbabilities() {
    try {
        areProbabilitiesGenerated = true;
        (document.getElementById("executeButton")).style.display = 'block';
        const numberOfProbabilities = Number(document.getElementById("numberOfProbabilities").value);
        if (isNaN(numberOfProbabilities) || numberOfProbabilities < 1 || numberOfProbabilities > 20) throw Error("Number of probabilites must be between 1 and 20");
        const inputsContainer = document.getElementById("input-dynamic-container");
        inputsContainer.innerHTML = "";
        generateCloseProbabilities(numberOfProbabilities, inputsContainer);
    } catch (error) {
        console.log(error);
        window.alert(error);
    }
}

function generateCloseProbabilities(numberOfProbabilities, inputsContainer) {
    const equalProbability = toFixedNumber(1 / numberOfProbabilities);
    const lastCoupleIndex = numberOfProbabilities % 2 === 0 ? numberOfProbabilities : numberOfProbabilities - 1;
    for (let inputIndex = 1; inputIndex <= lastCoupleIndex; inputIndex++) {
        const offset = toFixedNumber(Math.random() * (equalProbability / 2));
        createProbabilityInput(inputIndex, inputsContainer, toFixedNumber(equalProbability + offset));
        createProbabilityInput(++inputIndex, inputsContainer, toFixedNumber(equalProbability - offset));
    }
    if (numberOfProbabilities % 2 !== 0) createProbabilityInput(numberOfProbabilities, inputsContainer, equalProbability);
}

function createProbabilityInput(inputIndex, inputsContainer, probability) {
    const inputContainer = document.createElement("div");
    inputContainer.className = "column";
    const label = document.createElement("label");
    label.textContent = "PR " + inputIndex;
    const input = document.createElement("input");
    input.type = "number";
    input.id = "PR" + inputIndex;
    inputsContainer.appendChild(inputContainer);
    inputContainer.appendChild(label);
    inputContainer.appendChild(input);
    input.value = probability;
}

function getInputData() {
    const numberOfProbabilites = Number(document.getElementById("numberOfProbabilities").value);
    const numberOfSamples = Number(document.getElementById("numberOfAttempts").value);
    const probabilityIntervals = [];
    let totalProbability = 0;
    for (let inputIndex = 1; inputIndex <= numberOfProbabilites; inputIndex++) {
        const probabilityInput = document.getElementById("PR" + inputIndex);
        const probability = Number(probabilityInput.value);
        if (isNaN(probability) || probability <= 0 || probability > 1) throw Error("Probability must be between 0 and 1");
        probabilityIntervals.push({
            intervalNumber: inputIndex,
            probability: probability,
            startProbability: totalProbability,
            endProbability: inputIndex === numberOfProbabilites ? 1 : totalProbability + probability,
            empiricDistribution: 0,
            theoreticalDistribution: probability * numberOfSamples
        });
        totalProbability = totalProbability + probability;
    }
    return { probabilityIntervals, numberOfSamples };
}

function toFixedNumber(num, digits = 3, base = 10){
    const pow = Math.pow(base, digits);
    return Math.round(num * pow) / pow;
}

function updateMeanVariance(mean, variance, newValue, count) {
    const delta = newValue - mean;
    const newMean = mean + delta / count;
    const newVariance = variance + delta * (newValue - newMean);
    return [newMean, newVariance];
}

function calculateMeanVariance(realizations) {
    let mean = 0, variance = 0;
    for (let i = 0; i < realizations.length; i++) [mean, variance] = updateMeanVariance(mean, variance, realizations[i], i + 1);
    return { mean, variance: variance / realizations.length };
}

function calculateMeanVarianceAllSteps(realizations) {
    let mean = 0, variance = 0;
    let iMean, iVariance;
    let means = [], variances = [];
    for (let i = 0; i < realizations.length; i++) {
        [iMean, iVariance] = updateMeanVariance(mean, variance, realizations[i], i + 1);
        mean = iMean;
        variance = iVariance;
        means.push(iMean);
        variances.push(iVariance / (i + 1));        
    }
    return { mean, variance: variance / realizations.length, means, variances};
}

function calculateTheoreticalMeanVariance(probabilitiesData) {
    let mean = 0; 
    let meanSquare = 0;

    for (let i = 0; i < probabilitiesData.length; i++) {
        mean += probabilitiesData[i].probability * probabilitiesData[i].intervalNumber;
        meanSquare += probabilitiesData[i].probability * Math.pow(probabilitiesData[i].intervalNumber, 2);        
    }

    const variance = meanSquare - Math.pow(mean, 2);
    return { mean, variance };
}
