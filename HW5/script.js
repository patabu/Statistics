const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

onDivisionTimeClick();
onIntermediateDistributionClick();

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 200;

const graphPositions = {
    xStart: canvas.width * 0.01,
    xEnd: canvas.width * 0.8,
    yStart: canvas.height * 0.05,
    yEnd: canvas.height * 0.9,
    yStartingPoint: (canvas.height * 0.9 + canvas.height * 0.05) / 2
}

function clearChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

drawChartAxis();

function drawChartAxis(randomWalkType, numberOfServers) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";

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

    // * Draw axis text
    ctx.textAlign = "center";
    if (randomWalkType !== 'stationary') {
        const boundValue = randomWalkType === 'biased' ? numberOfServers : Math.sqrt(numberOfServers);
        ctx.fillText(boundValue.toFixed(2), graphPositions.xStart, graphPositions.yEnd + 15);
        ctx.fillText(0, graphPositions.xStart - 10, graphPositions.yStartingPoint + 5);
        ctx.fillText(boundValue.toFixed(2), graphPositions.xStart, graphPositions.yStart - 5);
    } else {
        ctx.fillText(0, graphPositions.xStart, graphPositions.yEnd + 15);
        ctx.fillText(numberOfServers.toFixed(2), graphPositions.xStart, graphPositions.yStart - 5);
    }
    ctx.fillText(numberOfServers, graphPositions.xEnd, graphPositions.yEnd + 20);

    // * Draw final distribution dashed line
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(canvas.width - 20, graphPositions.yEnd);
    ctx.lineTo(canvas.width - 20, graphPositions.yStart);
    ctx.stroke();
    ctx.setLineDash([]);
}

function onExecute() {
    try {
        const { isDivisionTimeContinuous, randomWalkType, drawFinalDistribution, drawIntermediateDistribution, numberOfServers, numberOfAttackers, intermediateStep, probability } = getInputData(); 
        graphPositions.yStartingPoint = randomWalkType === 'stationary' ? graphPositions.yStartingPoint = graphPositions.yEnd : (canvas.height * 0.9 + canvas.height * 0.05) / 2;
        clearChart();
        drawChartAxis(randomWalkType, numberOfServers);
        ctx.font = "12px serif";

        const spacePerServerXAxis = (graphPositions.xEnd - graphPositions.xStart) / numberOfServers;
    
        let penetratedServersFinal = new Array((numberOfServers * (randomWalkType === 'stationary' ? 1 : 2)) + 1).fill(0);
        let penetratedServersIntermediate = new Array((numberOfServers * (randomWalkType === 'stationary' ? 1 : 2)) + 1).fill(0);
        
        const spacePerServerYAxis = (graphPositions.yEnd - graphPositions.yStart) / (numberOfServers * (randomWalkType === 'stationary' ? 1 : 2));
        ctx.lineWidth = 1.5;
    
        //  * Draw trajectories
    
        for (let attacker = 0; attacker < numberOfAttackers; attacker++) {
            let numberOfSuccessfulAttacks = 0;
            let lastY = graphPositions.yStartingPoint;
            ctx.strokeStyle = "#A1ADE5";
            for (let server = 0; server < numberOfServers; server++) {
                const xStartPoint = graphPositions.xStart + (spacePerServerXAxis * server); // * OK
                const xEndPoint = graphPositions.xStart + (spacePerServerXAxis * (server + 1)); // * OK
                const yStartPoint = lastY; // * Qui viene eseguito il calcolo per l'Y di partenza
                const isAttackSuccessful = Math.random() <= probability;
                if (isAttackSuccessful) {
                    numberOfSuccessfulAttacks++;
                    lastY -= spacePerServerYAxis;
                } else if (randomWalkType !== 'stationary'){
                    numberOfSuccessfulAttacks--;
                    lastY += spacePerServerYAxis;
                }
                const yEndPoint = lastY;

                if (intermediateStep && (server + 1) === intermediateStep) penetratedServersIntermediate[randomWalkType === 'stationary' ? numberOfSuccessfulAttacks : numberOfServers + numberOfSuccessfulAttacks]++;

                ctx.beginPath();
                ctx.moveTo(xStartPoint, yStartPoint);
                ctx.lineTo(xEndPoint, yEndPoint);
                ctx.stroke();
            }      
            penetratedServersFinal[randomWalkType === 'stationary' ? numberOfSuccessfulAttacks : numberOfServers + numberOfSuccessfulAttacks]++;             
        }
        console.log(penetratedServersFinal);
    
        // * Draw intermediate and final distribution
        drawDistribution(intermediateStep, numberOfServers, randomWalkType, penetratedServersIntermediate, spacePerServerXAxis);
        drawDistribution(numberOfServers, numberOfServers, randomWalkType, penetratedServersFinal, spacePerServerXAxis);
    } catch (error) {
        console.log(error);
        window.alert(error);
    }
}

function drawDistribution(step, numberOfServers, randomWalkType, penetratedServers, spacePerServerXAxis) {
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1.5;
    const maxHackersOnSameServer = Math.max(...penetratedServers);
    const spaceForHackerDistribution = ((canvas.width * 1 / 5) - 20) / maxHackersOnSameServer;
    const xStartPoint = graphPositions.xStart + (spacePerServerXAxis * (step));
    for (let server = (numberOfServers * (randomWalkType === 'stationary' ? 1 : 2)) + 1; server >= 0; server--) {
        if (!penetratedServers[server]) continue;
        const xEndPoint = xStartPoint + (spaceForHackerDistribution * penetratedServers[server]);
        const y = graphPositions.yStart + (((graphPositions.yEnd - graphPositions.yStart) / ((numberOfServers * (randomWalkType === 'stationary' ? 1 : 2)))) * ((numberOfServers * (randomWalkType === 'stationary' ? 1 : 2)) - server));
        ctx.strokeStyle = "#ff0000";
        ctx.beginPath();
        ctx.moveTo(xStartPoint, y);
        ctx.lineTo(xEndPoint, y);
        ctx.stroke();
    }
    if (step === numberOfServers) ctx.fillText(maxHackersOnSameServer, canvas.width - 20, graphPositions.yEnd + 20);
}

function getInputData() {
    const isDivisionTimeContinuous = (document.getElementById("continuousDivision")).checked;

    const randomWalkType = document.querySelector('input[name="randomWalk"]:checked').value;   

    const drawFinalDistribution = (document.getElementById("finalDistribution")).checked;

    const drawIntermediateDistribution = (document.getElementById("intermediateDistribution")).checked;

    const numberOfServers = isDivisionTimeContinuous ? 1000 : Number(document.getElementById("numberOfServers").value);
    if (numberOfServers <= 0 || numberOfServers > 10000) throw Error("Intervals must be between 1 and 10000");
    
    const numberOfAttackers = Number(document.getElementById("numberOfAttackers").value);
    if (numberOfAttackers <= 0 || numberOfAttackers > 10000) throw Error("Attackers must be between 1 and 10000");

    const intermediateStep = drawIntermediateDistribution ? Number(document.getElementById("intermediateStep").value) : 0;
    if (drawIntermediateDistribution && (intermediateStep < 1 || intermediateStep >= numberOfServers)) throw Error('The intermediate step must be between 1 and ' + (numberOfServers - 1));

    let probability = Number(document.getElementById("probability").value); 
    if (isDivisionTimeContinuous) {
        if (probability < 1 || probability > numberOfServers) throw Error("Probability must be between 1 and 1000");
        probability = probability / numberOfServers;
    } else {
        if (probability < 0 || probability > 1) throw Error("Probability must be between 0 and 1");
    }

    return { isDivisionTimeContinuous, randomWalkType, drawFinalDistribution, drawIntermediateDistribution, numberOfServers, numberOfAttackers, intermediateStep, probability };
}

function onDivisionTimeClick() {
    const isDivisionTimeContinuous = (document.getElementById("continuousDivision")).checked;
    if (isDivisionTimeContinuous) {
        (document.getElementById("serversInput")).style.display = 'none';
        (document.getElementById("sqrtBiasedInput")).style.display = 'block';
        document.getElementById("probabilityText").innerText = 'Lambda';
        document.getElementById("probability").value = 100;
    } else {
        if((document.getElementById("sqrtBiasedRandomWalk")).checked) {
            (document.getElementById("sqrtBiasedRandomWalk")).checked = false;
            (document.getElementById("biasedRandomWalk")).checked = true;
        }
        (document.getElementById("serversInput")).style.display = 'block';
        (document.getElementById("sqrtBiasedInput")).style.display = 'none';
        document.getElementById("probabilityText").innerText = 'Probability';
        document.getElementById("probability").value = 0.5;
    }
}

function onIntermediateDistributionClick() {
    (document.getElementById("intermediateStepInput")).style.display = (document.getElementById("intermediateDistribution")).checked ? 'block' : 'none';
}