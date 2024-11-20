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
    ctx.fillText('Theoretical', ((graphPositions.xEnd - graphPositions.xStart) / 2) + graphPositions.xStart + 120, graphPositions.yStart - 20)
}

function drawChartLines(probabilities) {
    const spacePerProbability = (graphPositions.xEnd - graphPositions.xStart) / probabilities.length;

    const higherDistribution = Math.max(...(probabilities.map(probabilityData => [probabilityData.empiricDistribution, probabilityData.theoreticalDistribution])).flat());    
    const distributionPerSpace = higherDistribution / 10;
    
    const graphHeight = graphPositions.yEnd - graphPositions.yStart;
    const spacePerDistribution = graphHeight / 10;

    const padding = spacePerProbability / 20;
    const distributionWidth = (spacePerProbability - (3 * padding)) / 2;
    for (let distributionIndex = 0; distributionIndex < probabilities.length; distributionIndex++) {
        // * Empiric
        
        ctx.beginPath();
        ctx.fillStyle = "#329e11"; 
        ctx.rect(
            (graphPositions.xStart + (distributionIndex * spacePerProbability)) + padding,
            graphPositions.yEnd - 1,
            distributionWidth,
            -((probabilities[distributionIndex].empiricDistribution / higherDistribution) * graphHeight)
        );
        ctx.fill();

        // * Theoretical
        ctx.fillStyle = "#bec748";
        ctx.beginPath();
        ctx.rect(
            (graphPositions.xStart + (distributionIndex * spacePerProbability)) + (2 * padding) + distributionWidth,
            graphPositions.yEnd - 1,
            distributionWidth,
            -((probabilities[distributionIndex].theoreticalDistribution / higherDistribution) * graphHeight)
        );
        ctx.fill();
        
        ctx.fillStyle = "#000000";
        ctx.fillText(`(${probabilities[distributionIndex].startProbability.toFixed(2)}, ${probabilities[distributionIndex].endProbability.toFixed(2)}]`, (graphPositions.xStart + (distributionIndex * spacePerProbability)), graphPositions.yEnd + 15)
    }

    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";

    ctx.strokeStyle = "#9ca0a6";
    ctx.lineWidth = .5;
    for (let indexProbability = 1; indexProbability < probabilities.length; indexProbability++) {
        ctx.beginPath();
        ctx.moveTo(graphPositions.xStart + (spacePerProbability * indexProbability), graphPositions.yStart);
        ctx.lineTo(graphPositions.xStart + (spacePerProbability * indexProbability), graphPositions.yEnd);
        ctx.stroke();
    }

    for (let horizontalRowIndex = 0; horizontalRowIndex < 10; horizontalRowIndex++) {
        const y = graphPositions.yStart + (spacePerDistribution * horizontalRowIndex)
        ctx.beginPath();
        ctx.moveTo(graphPositions.xStart, y);
        ctx.lineTo(graphPositions.xEnd, y);
        ctx.stroke();
        ctx.fillText((higherDistribution - (distributionPerSpace * horizontalRowIndex)).toFixed(2), graphPositions.xStart - 35, y);
    }

}

function drawMeanAndVariance(probabilitiesData, values) {
    const { mean: theoreticalMean, variance: theoreticalVariance} = calculateTheoreticalMeanVariance(probabilitiesData);
    const { mean: empiricMean, variance: empiricVariance, means, variances } = calculateMeanVarianceAllSteps(values);
    const meanOfMeans = means.reduce((sum, val) => sum + val, 0) / means.length; // * Calcolo della media delle medie
    const meanOfVariances = variances.reduce((sum, val) => sum + val, 0) / variances.length; // * Calcolo della media delle varianze
    ctx.fillStyle = "#000000";
    ctx.fillText('Theoretical Mean: ' + theoreticalMean.toFixed(3), ((graphPositions.xEnd - graphPositions.xStart) / 2) + graphPositions.xStart - 380, graphPositions.yEnd + 40);
    ctx.fillText('Theoretical Variance: ' + theoreticalVariance.toFixed(3), ((graphPositions.xEnd - graphPositions.xStart) / 2) + graphPositions.xStart - 380, graphPositions.yEnd + 60);
    ctx.fillText('Empiric Mean: ' + empiricMean.toFixed(3), ((graphPositions.xEnd - graphPositions.xStart) / 2) + graphPositions.xStart - 180, graphPositions.yEnd + 40);
    ctx.fillText('Empiric Variance: ' + empiricVariance.toFixed(3), ((graphPositions.xEnd - graphPositions.xStart) / 2) + graphPositions.xStart - 180, graphPositions.yEnd + 60);
    ctx.fillText('Mean of means: ' + meanOfMeans.toFixed(3), ((graphPositions.xEnd - graphPositions.xStart) / 2) + graphPositions.xStart + 20, graphPositions.yEnd + 40);
    ctx.fillText('Mean of variances: ' + meanOfVariances.toFixed(3), ((graphPositions.xEnd - graphPositions.xStart) / 2) + graphPositions.xStart + 20, graphPositions.yEnd + 60);

    
}

function onExecute() {
    try {
        const { probabilitiesData, numberOfAttempts } = getInputData();
        clearChart();
        drawChartAxis();
        const values = [];

        for (let attempt = 1; attempt <= numberOfAttempts; attempt++) {
            const probability = toFixedNumber(Math.random());
            for (let probabilityIndex = 0; probabilityIndex < probabilitiesData.length; probabilityIndex++) {
                const probabilityElement = probabilitiesData[probabilityIndex]
                if (probability > probabilityElement.startProbability && probability <= probabilityElement.endProbability) {
                    probabilityElement.empiricDistribution++;
                    values.push(probabilityElement.intervalNumber);
                }
            }
        }
        drawChartLines(probabilitiesData);
        drawMeanAndVariance(probabilitiesData, values);
    } catch (error) {
        console.log(error);
        window.alert(error);
    }
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
    const numberOfAttempts = Number(document.getElementById("numberOfAttempts").value);
    const probabilitiesData = [];
    let totalProbability = 0;
    for (let inputIndex = 1; inputIndex <= numberOfProbabilites; inputIndex++) {
        const probabilityInput = document.getElementById("PR" + inputIndex);
        const probability = Number(probabilityInput.value);
        if (isNaN(probability) || probability <= 0 || probability > 1) throw Error("Probability must be between 0 and 1");
        probabilitiesData.push({
            intervalNumber: inputIndex,
            probability: probability,
            startProbability: totalProbability,
            endProbability: inputIndex === numberOfProbabilites ? 1 : totalProbability + probability,
            empiricDistribution: 0,
            theoreticalDistribution: probability * numberOfAttempts
        });
        totalProbability = totalProbability + probability;
    }
    return { probabilitiesData, numberOfAttempts };
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
