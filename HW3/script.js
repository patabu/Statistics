const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 200;

const graphPositions = {
    xStart: canvas.width * 0.01,
    xEnd: canvas.width * 0.8,
    yStart: canvas.height * 0.05,
    yEnd: canvas.height * 0.9,
    yStartingPoint: canvas.height * 0.9
}

function clearChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

drawChartAxis();

function drawChartAxis() {
    ctx.lineWidth = 2;

    // * Draw Y-axis
    ctx.beginPath();
    ctx.moveTo(graphPositions.xEnd, graphPositions.yEnd);
    ctx.lineTo(graphPositions.xEnd, graphPositions.yStart);
    ctx.stroke();

    // * Draw X-axis
    ctx.beginPath();
    ctx.moveTo(graphPositions.xStart, graphPositions.yEnd);
    ctx.lineTo(graphPositions.xEnd, graphPositions.yEnd);
    ctx.stroke();
}

function onExecute() {
    try {
        const { numberOfIntervals, numberOfAttackers, lambda } = getInputData(); 
        const probability = lambda / numberOfIntervals;
        clearChart();
        drawChartAxis();
        ctx.font = "12px serif";
        const spacePerServer = (graphPositions.xEnd - graphPositions.xStart) / numberOfIntervals;
    
        let penetratedServers = new Array(numberOfIntervals + 1).fill(0);
    
        ctx.fillText(0, graphPositions.xStart, graphPositions.yEnd + 20)
        ctx.fillText(numberOfIntervals, graphPositions.xEnd, graphPositions.yEnd + 20)
    
        const spaceForServer = (graphPositions.yEnd - graphPositions.yStart) / numberOfIntervals;
        ctx.lineWidth = 1.5;
    
    
        for (let attacker = 0; attacker < numberOfAttackers; attacker++) {
            let numberOfSuccessfulAttacks = 0;
            ctx.strokeStyle = "#" + Math.floor(Math.random()*16777215).toString(16);
            for (let server = 0; server < numberOfIntervals; server++) {
                const xStartPoint = graphPositions.xStart + (spacePerServer * server);
                const xEndPoint = graphPositions.xStart + (spacePerServer * (server + 1))
                const yStartPoint = (graphPositions.yEnd - (spaceForServer * numberOfSuccessfulAttacks));
                const isAttackSuccessful = Math.random() <= probability;
                if (isAttackSuccessful) numberOfSuccessfulAttacks++;
                const yEndPoint = (graphPositions.yEnd - (spaceForServer * numberOfSuccessfulAttacks));
                ctx.beginPath();
                ctx.moveTo(xStartPoint, yStartPoint);
                ctx.lineTo(xEndPoint, yEndPoint);
                ctx.stroke();
            }      
            penetratedServers[numberOfSuccessfulAttacks]++; 
        }
    
        ctx.strokeStyle = "#000000";
        const maxHackersOnSameServer = Math.max(...penetratedServers);
        const spaceForHackerDistribution = ((canvas.width * 1 / 5) - 20) / maxHackersOnSameServer;
        for (let server = 0; server <= numberOfIntervals; server++) {
            if (!penetratedServers[server]) continue;
            const xStartPoint = graphPositions.xEnd;
            const xEndPoint = xStartPoint + (spaceForHackerDistribution * penetratedServers[server]);
            const y = graphPositions.yEnd - (((graphPositions.yEnd - graphPositions.yStart) / numberOfIntervals) * (server));
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

    const lambda = Number(document.getElementById("lambda").value);
    if (lambda <= 0 || lambda > numberOfIntervals) throw Error("Lambda must be between 1 and " + numberOfIntervals);

    return { numberOfIntervals, numberOfAttackers, lambda };
}