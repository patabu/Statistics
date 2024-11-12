const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

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
}

function drawChartLines(probabilities, distributions, numberOfAttempts) {
    const spacePerProbability = (graphPositions.xEnd - graphPositions.xStart) / distributions.length;
    ctx.strokeStyle = "#9ca0a6";
    ctx.lineWidth = .5;
    for (let indexProbability = 1; indexProbability < distributions.length; indexProbability++) {
        ctx.beginPath();
        ctx.moveTo(graphPositions.xStart + (spacePerProbability * indexProbability), graphPositions.yStart);
        ctx.lineTo(graphPositions.xStart + (spacePerProbability * indexProbability), graphPositions.yEnd);
        ctx.stroke();
    }

    const higherDistribution = Math.max(...distributions);    
    const distributionPerSpace = higherDistribution / 10;
    const graphHeight = graphPositions.yEnd - graphPositions.yStart;
    const spacePerDistribution = graphHeight / 10;

    for (let horizontalRowIndex = 0; horizontalRowIndex < 10; horizontalRowIndex++) {
        const y = graphPositions.yStart + (spacePerDistribution * horizontalRowIndex)
        ctx.beginPath();
        ctx.moveTo(graphPositions.xStart, y);
        ctx.lineTo(graphPositions.xEnd, y);
        ctx.stroke();
        ctx.fillText((higherDistribution - (distributionPerSpace * horizontalRowIndex)).toFixed(2), graphPositions.xStart - 25, y);
    }

    const padding = spacePerProbability / 20;
    const distributionWidth = (spacePerProbability - (3 * padding)) / 2;
    for (let distributionIndex = 0; distributionIndex < distributions.length; distributionIndex++) {
        // * Empiric
        console.log(distributions[distributionIndex]);
        
        ctx.beginPath();
        ctx.fillStyle = "#1089e2"; 
        ctx.rect(
            (graphPositions.xStart + (distributionIndex * spacePerProbability)) + padding,
            graphPositions.yEnd,
            distributionWidth,
            -((distributions[distributionIndex] / higherDistribution) * graphHeight)
        );
        ctx.fill();
        // * Theoretical
        ctx.fillStyle = "#53ef21"
        ctx.beginPath();
        ctx.rect(
            (graphPositions.xStart + (distributionIndex * spacePerProbability)) + (2 * padding) + distributionWidth,
            graphPositions.yEnd,
            distributionWidth,
            -(((probabilities[distributionIndex] * numberOfAttempts) / higherDistribution) * graphHeight)
        );
        ctx.fill(); 

    }



    ctx.strokeStyle = "#000000";
}

// * La probabilità definisce un salto di +- sqrt(1/numberOfIntervals)

function onExecute() {
    try {
        // const { numberOfIntervals, numberOfAttackers, probability } = getInputData();
        const {probabilities, numberOfAttempts} = getInputData();
        clearChart();
        drawChartAxis();
        const distributions = new Array(probabilities.length).fill(0);
        for (let probabilityIndex = 0; probabilityIndex < probabilities.length; probabilityIndex++) {
            for (let attempt = 1; attempt <= numberOfAttempts; attempt++) {
                if (Math.random() <= probabilities[probabilityIndex]) distributions[probabilityIndex]++;
            }
        }
        drawChartLines(probabilities, distributions, 50);
        // ctx.font = "12px serif";
        // const spacePerServerXAxis = (graphPositions.xEnd - graphPositions.xStart) / numberOfIntervals;
    
        // let penetratedServers = new Array((numberOfIntervals * 2) + 1).fill(0);
    
        // ctx.textAlign = "center";
        // ctx.fillText(0, graphPositions.xStart - 10, graphPositions.yStartingPoint + 5);
        // ctx.fillText(Math.sqrt(numberOfIntervals).toFixed(2), graphPositions.xStart, graphPositions.yStart - 5)
        // ctx.fillText(-Math.sqrt(numberOfIntervals).toFixed(2), graphPositions.xStart, graphPositions.yEnd + 15)
        // ctx.fillText(numberOfIntervals, graphPositions.xEnd, graphPositions.yEnd + 20)
        
        // const spacePerServerYAxis = (graphPositions.yEnd - graphPositions.yStart) / (numberOfIntervals * 2);
        // ctx.lineWidth = 1.5;
    
    
        // for (let attacker = 0; attacker < numberOfAttackers; attacker++) {
        //     let numberOfSuccessfulAttacks = numberOfIntervals;
        //     ctx.strokeStyle = "#" + Math.floor(Math.random()*16777215).toString(16);
        //     for (let server = 0; server < numberOfIntervals; server++) {
        //         const xStartPoint = graphPositions.xStart + (spacePerServerXAxis * server);
        //         const xEndPoint = graphPositions.xStart + (spacePerServerXAxis * (server + 1))
        //         const yStartPoint = (graphPositions.yStartingPoint + (spacePerServerYAxis * (numberOfIntervals - numberOfSuccessfulAttacks))); // * Qui viene eseguito il calcolo per l'Y di partenza
        //         numberOfSuccessfulAttacks += Math.random() <= probability ? 1 : -1;
        //         const yEndPoint = (graphPositions.yStartingPoint + (spacePerServerYAxis * (numberOfIntervals - numberOfSuccessfulAttacks)));
        //         ctx.beginPath();
        //         ctx.moveTo(xStartPoint, yStartPoint);
        //         ctx.lineTo(xEndPoint, yEndPoint);
        //         ctx.stroke();
        //     }      
        //     penetratedServers[numberOfSuccessfulAttacks]++;             
        // }
        // console.log(penetratedServers);
    
        // ctx.strokeStyle = "#000000";
        // const maxHackersOnSameServer = Math.max(...penetratedServers);
        // const spaceForHackerDistribution = ((canvas.width * 1 / 5) - 20) / maxHackersOnSameServer;
        // for (let server = (numberOfIntervals * 2) + 1; server >= 0; server--) {
        //     if (!penetratedServers[server]) continue;
        //     const xStartPoint = graphPositions.xEnd;
        //     const xEndPoint = xStartPoint + (spaceForHackerDistribution * penetratedServers[server]);
        //     const y = graphPositions.yStart + (((graphPositions.yEnd - graphPositions.yStart) / ((numberOfIntervals * 2) + 1)) * ((numberOfIntervals * 2) - server));
        //     ctx.strokeStyle = "#ff0000";
        //     ctx.beginPath();
        //     ctx.moveTo(xStartPoint, y);
        //     ctx.lineTo(xEndPoint, y);
        //     ctx.stroke();
        // }
    
        // ctx.strokeStyle = "#000000";
        // ctx.beginPath();
        // ctx.setLineDash([5, 5]);
        // ctx.moveTo(canvas.width - 20, graphPositions.yEnd);
        // ctx.lineTo(canvas.width - 20, graphPositions.yStart);
        // ctx.stroke();
        // ctx.fillText(maxHackersOnSameServer, canvas.width - 20, graphPositions.yEnd + 20);
        // ctx.setLineDash([]);
    } catch (error) {
        console.log(error);
        window.alert(error);
    }
}

function generateProbabilities() { // * Le probabilità devono essere intervalli!!! 0 - 0.2 / 0.2 - 0.35 / 0.35 - 0.6 ...
    try {
        const numberOfProbabilities = Number(document.getElementById("numberOfProbabilities").value);
        if (isNaN(numberOfProbabilities) || numberOfProbabilities < 1 || numberOfProbabilities > 20) throw Error("Number of probabilites must be between 1 and 20");
        const inputsContainer = document.getElementById("input-dynamic-container");
        inputsContainer.innerHTML = "";
        const isProbabilityRandom = (document.getElementById("randomProbabilities")).checked;
        console.log(isProbabilityRandom);
        

        if (isProbabilityRandom) generateRandomProbabilities(numberOfProbabilities, inputsContainer);
        else generateCloseProbabilities(numberOfProbabilities, inputsContainer);
    } catch (error) {
        console.log(error);
        window.alert(error);
    }
}

function generateRandomProbabilities(numberOfProbabilities, inputsContainer) {
    let max = 1;
    for (let inputIndex = 1; inputIndex <= numberOfProbabilities; inputIndex++) {
        const probability = Math.random() * max;
        max -= probability;
        createProbabilityInput(inputIndex, inputsContainer, probability);
    }
}

function generateCloseProbabilities(numberOfProbabilities, inputsContainer) {
    const equalProbability = 1 / numberOfProbabilities;
    const lastCoupleIndex = numberOfProbabilities % 2 === 0 ? numberOfProbabilities : numberOfProbabilities - 1;
    for (let inputIndex = 1; inputIndex <= lastCoupleIndex; inputIndex++) {
        const offset = Math.random() * (equalProbability / 2);
        createProbabilityInput(inputIndex, inputsContainer, equalProbability + offset);
        createProbabilityInput(++inputIndex, inputsContainer, equalProbability - offset);
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
    const probabilities = [];
    let totalProbability = 0;
    for (let inputIndex = 1; inputIndex <= numberOfProbabilites; inputIndex++) {
        const probabilityInput = document.getElementById("PR" + inputIndex);
        const probability = Number(probabilityInput.value);
        if (isNaN(probability) || probability < 0 || probability > 1) throw Error("Probability must be between 0 and 1");
        probabilities.push(probability);
        totalProbability += probability;
    }
    if (totalProbability > 1) throw Error("Sum of probabilities must be less than 1");
    return {probabilities, numberOfAttempts};
}