const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 200;

const graphPositions = {
    yAxis: {
        x: {
            start: canvas.width * 4 / 5,
            end: canvas.width * 4 / 5
        },
        y: {
            start: canvas.height * 0.05,
            end: canvas.height * 0.9
        }
    },
    xAxis: {
        x: {
            start: canvas.width * 4 / 5,
            end: canvas.width * 0.01
        },
        y: {
            start: canvas.height * 0.9,
            end: canvas.height * 0.9
        }
    }
}

function clearChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

drawChartAxis();

function drawChartAxis() {
    ctx.lineWidth = 2;

    // * Draw Y-axis
    ctx.beginPath();
    ctx.moveTo(graphPositions.yAxis.x.end, graphPositions.yAxis.y.end);
    ctx.lineTo(graphPositions.yAxis.x.start, graphPositions.yAxis.y.start);
    ctx.stroke();

    // * Draw X-axis
    ctx.beginPath();
    ctx.moveTo(graphPositions.xAxis.x.end, graphPositions.xAxis.y.end);
    ctx.lineTo(graphPositions.xAxis.x.start, graphPositions.xAxis.y.start);
    ctx.stroke();
}

function onExecute() {
    try {
        const { numberOfServers, numberOfAttackers, probability } = getInputData(); 
        clearChart();
        drawChartAxis();
        ctx.font = "12px serif";
        const spacePerServer = (graphPositions.xAxis.x.start - graphPositions.xAxis.x.end) / numberOfServers;
    
        let penetratedServers = new Array(numberOfServers + 1).fill(0);
    
        ctx.fillText(0, graphPositions.xAxis.x.end, graphPositions.xAxis.y.start + 20)
        ctx.fillText(numberOfServers, graphPositions.xAxis.x.start, graphPositions.xAxis.y.start + 20)
    
        const spaceForServer = (graphPositions.yAxis.y.end - graphPositions.yAxis.y.start) / numberOfServers;
        ctx.lineWidth = 1.5;
    
    
        for (let attacker = 0; attacker < numberOfAttackers; attacker++) {
            let numberOfSuccessfulAttacks = 0;
            ctx.strokeStyle = "#" + Math.floor(Math.random()*16777215).toString(16);
            for (let server = 0; server < numberOfServers; server++) {
                const xStartPoint = graphPositions.xAxis.x.end + (spacePerServer * server);
                const xEndPoint = graphPositions.xAxis.x.end + (spacePerServer * (server + 1))
                const yStartPoint = (graphPositions.xAxis.y.start - (spaceForServer * numberOfSuccessfulAttacks));
                const isAttackSuccessful = Math.random() <= probability;
                if (isAttackSuccessful) numberOfSuccessfulAttacks++;
                const yEndPoint = (graphPositions.xAxis.y.start - (spaceForServer * numberOfSuccessfulAttacks));
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
        for (let server = 0; server <= numberOfServers; server++) {
            if (!penetratedServers[server]) continue;
            const xStartPoint = graphPositions.xAxis.x.start;
            const xEndPoint = xStartPoint + (spaceForHackerDistribution * penetratedServers[server]);
            const y = graphPositions.yAxis.y.end - (((graphPositions.yAxis.y.end - graphPositions.yAxis.y.start) / numberOfServers) * (server));
            ctx.strokeStyle = "#ff0000";
            ctx.beginPath();
            ctx.moveTo(xStartPoint, y);
            ctx.lineTo(xEndPoint, y);
            ctx.stroke();
        }
    
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(canvas.width - 20, graphPositions.yAxis.y.end);
        ctx.lineTo(canvas.width - 20, graphPositions.yAxis.y.start);
        ctx.stroke();
        ctx.fillText(maxHackersOnSameServer, canvas.width - 20, graphPositions.yAxis.y.end + 20);
        ctx.setLineDash([]);
    } catch (error) {
        window.alert(error);
    }
}

function getInputData() {
    const numberOfServers = Number(document.getElementById("servers").value);
    if (numberOfServers <= 0) throw Error("Servers must be at least 1");
    
    const numberOfAttackers = Number(document.getElementById("attackers").value);
    if (numberOfAttackers <= 0) throw Error("Attackers must be at least 1");

    const probability = Number(document.getElementById("probability").value);
    if (probability <= 0 || probability >= 1) throw Error("Probability must be between 0 and 1");

    return { numberOfServers, numberOfAttackers, probability };
}