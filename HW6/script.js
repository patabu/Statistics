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

    ctx.fillStyle = "#78ad86";
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
        ctx.fillStyle = "#78ad86";
        ctx.beginPath();
        ctx.rect(
            (graphPositions.xStart + (distributionIndex * spacePerProbability)) + (2 * padding) + distributionWidth,
            graphPositions.yEnd - 1,
            distributionWidth,
            -((probabilities[distributionIndex].theoreticalDistribution / higherDistribution) * graphHeight)
        );
        ctx.fill(); 
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

function onExecute() {
    try {
        const { probabilitiesData, numberOfAttempts } = getInputData();
        clearChart();
        drawChartAxis();
        for (let probabilityIndex = 0; probabilityIndex < probabilitiesData.length; probabilityIndex++) {
            const probabilityElement = probabilitiesData[probabilityIndex]
            console.log('Probability n.' + (probabilityIndex + 1) + " Range " + probabilityElement.startProbability + " - " + probabilityElement.endProbability);
            for (let attempt = 1; attempt <= numberOfAttempts; attempt++) {
                const probability = toFixedNumber(Math.random());
                if (probability > probabilityElement.startProbability && probability <= probabilityElement.endProbability) {
                    console.log('Success');
                    probabilityElement.empiricDistribution++;
                }
            }
            console.log(probabilityElement.empiricDistribution + ' successful attempts');
        }
        drawChartLines(probabilitiesData);
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
            startProbability: totalProbability,
            endProbability: inputIndex === numberOfProbabilites ? 1 : totalProbability + probability,
            empiricDistribution: 0,
            theoreticalDistribution: probability * numberOfAttempts
        });
        totalProbability = totalProbability + probability;
    }
    return {probabilitiesData, numberOfAttempts};
}

function toFixedNumber(num, digits = 3, base = 10){
    const pow = Math.pow(base, digits);
    return Math.round(num * pow) / pow;
}