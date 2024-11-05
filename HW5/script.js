const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

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

// * La probabilità definisce un salto di +- sqrt(1/numberOfIntervals)

function onExecute() {
    try {
        console.log(graphPositions.yStart, graphPositions.yEnd, graphPositions.yStartingPoint);
        const { numberOfIntervals, numberOfAttackers, probability } = getInputData(); 
        clearChart();
        drawChartAxis();
        ctx.font = "12px serif";
        const spacePerServerXAxis = (graphPositions.xEnd - graphPositions.xStart) / numberOfIntervals;
    
        let penetratedServers = new Array((numberOfIntervals * 2) + 1).fill(0);
    
        ctx.textAlign = "center";
        ctx.fillText(0, graphPositions.xStart - 10, graphPositions.yStartingPoint + 5);
        ctx.fillText(Math.sqrt(numberOfIntervals).toFixed(2), graphPositions.xStart, graphPositions.yStart - 5)
        ctx.fillText(-Math.sqrt(numberOfIntervals).toFixed(2), graphPositions.xStart, graphPositions.yEnd + 15)
        ctx.fillText(numberOfIntervals, graphPositions.xEnd, graphPositions.yEnd + 20)
        
        const spacePerServerYAxis = (graphPositions.yEnd - graphPositions.yStart) / (numberOfIntervals * 2);
        ctx.lineWidth = 1.5;
    
    
        for (let attacker = 0; attacker < numberOfAttackers; attacker++) {
            let numberOfSuccessfulAttacks = numberOfIntervals;
            ctx.strokeStyle = "#" + Math.floor(Math.random()*16777215).toString(16);
            for (let server = 0; server < numberOfIntervals; server++) {
                const xStartPoint = graphPositions.xStart + (spacePerServerXAxis * server);
                const xEndPoint = graphPositions.xStart + (spacePerServerXAxis * (server + 1))
                const yStartPoint = (graphPositions.yStartingPoint + (spacePerServerYAxis * (numberOfIntervals - numberOfSuccessfulAttacks))); // * Qui viene eseguito il calcolo per l'Y di partenza
                numberOfSuccessfulAttacks += Math.random() <= probability ? 1 : -1;
                const yEndPoint = (graphPositions.yStartingPoint + (spacePerServerYAxis * (numberOfIntervals - numberOfSuccessfulAttacks)));
                ctx.beginPath();
                ctx.moveTo(xStartPoint, yStartPoint);
                ctx.lineTo(xEndPoint, yEndPoint);
                ctx.stroke();
            }      
            penetratedServers[numberOfSuccessfulAttacks]++;             
        }
        console.log(penetratedServers);
    
        ctx.strokeStyle = "#000000";
        const maxHackersOnSameServer = Math.max(...penetratedServers);
        const spaceForHackerDistribution = ((canvas.width * 1 / 5) - 20) / maxHackersOnSameServer;
        for (let server = (numberOfIntervals * 2) + 1; server >= 0; server--) {
            if (!penetratedServers[server]) continue;
            const xStartPoint = graphPositions.xEnd;
            const xEndPoint = xStartPoint + (spaceForHackerDistribution * penetratedServers[server]);
            const y = graphPositions.yStart + (((graphPositions.yEnd - graphPositions.yStart) / ((numberOfIntervals * 2) + 1)) * ((numberOfIntervals * 2) - server));
            ctx.strokeStyle = "#ff0000";
            ctx.beginPath();
            ctx.moveTo(xStartPoint, y);
            ctx.lineTo(xEndPoint, y);
            ctx.stroke();
        }
    
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(canvas.width - 20, graphPositions.yEnd);
        ctx.lineTo(canvas.width - 20, graphPositions.yStart);
        ctx.stroke();
        ctx.fillText(maxHackersOnSameServer, canvas.width - 20, graphPositions.yEnd + 20);
        ctx.setLineDash([]);
    } catch (error) {
        window.alert(error);
    }
}

function getInputData() {
    const numberOfIntervals = Number(document.getElementById("intervals").value);
    if (numberOfIntervals <= 0 || numberOfIntervals > 10000) throw Error("Intervals must be between 1 and 10000");
    
    const numberOfAttackers = Number(document.getElementById("attackers").value);
    if (numberOfAttackers <= 0 || numberOfAttackers > 10000) throw Error("Attackers must be between 1 and 10000");

    const probability = Number(document.getElementById("probability").value);
    if (probability < 0 || probability > 1) throw Error("Probability must be between 0 and 1");

    return { numberOfIntervals, numberOfAttackers, probability };
}