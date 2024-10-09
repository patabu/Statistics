const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight / 2;
console.log(canvas.width);

const margin = 20;

const graphPositions = {
    yAxis: {
        x: {
            start: canvas.width * 2 / 3,
            end: canvas.width * 2 / 3
        },
        y: {
            start: canvas.height * 0.1,
            end: canvas.height * 0.8
        }
    },
    xAxis: {
        x: {
            start: canvas.width * 2 / 3,
            end: canvas.width * 0.05
        },
        y: {
            start: canvas.height * 0.8,
            end: canvas.height * 0.8
        }
    }
}

drawAxis();

function drawAxis() {
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxis();
    ctx.font = "12px serif";
    const servers = document.getElementById("servers").value;
    if (servers <= 0) {
        window.alert("Servers must be at least 1");
        return;
    }
    const attackers = document.getElementById("attackers").value;
    if (attackers <= 0) {
        window.alert("Attackers must be at least 1");
        return;
    }
    const probability = document.getElementById("probability").value;
    if (probability <= 0 || probability >= 1) {
        window.alert("Probability must be between 0 and 1 excluded")
        return;
    }
    const space = (graphPositions.xAxis.x.start - graphPositions.xAxis.x.end) / servers;
    
    let penetratedServers = [];
    for (let server = 0; server <= servers; server++) {
        penetratedServers[server] = 0;
        ctx.textAlign = "center";
        ctx.fillText(server, graphPositions.xAxis.x.end + (space * server), graphPositions.xAxis.y.start + 20)
        ctx.beginPath();
        ctx.moveTo(graphPositions.xAxis.x.end + (space * server), graphPositions.xAxis.y.start);
        ctx.lineTo(graphPositions.xAxis.x.end + (space * server), graphPositions.xAxis.y.start + 4);
        ctx.stroke();
    }

    // ctx.lineWidth = 2.5;
    // ctx.beginPath();
    // ctx.moveTo(1180, 100)
    // ctx.lineTo(1200, 100)
    // ctx.stroke()

    const spaceForServer = (graphPositions.yAxis.y.end - graphPositions.yAxis.y.start) / servers;
    ctx.lineWidth = 1.5;


    for (let attacker = 0; attacker < attackers; attacker++) {
        let numberOfSuccessfulAttacks = 0;
        ctx.strokeStyle = "#" + Math.floor(Math.random()*16777215).toString(16);
        for (let server = 0; server < servers; server++) {
            const xStartPoint = graphPositions.xAxis.x.end + (space * server);
            const xEndPoint = graphPositions.xAxis.x.end + (space * (server + 1))
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
    

    // ctx.beginPath();
    // ctx.moveTo(1200, 400);
    // ctx.lineTo(1500, 400);
    // ctx.stroke();

    // ctx.fillText(maxHackersOnSameServer, 1500, 420);

    for (let numberOfServers = 0; numberOfServers <= servers; numberOfServers++) {
        if (!penetratedServers[numberOfServers]) continue;
        const xStartPoint = graphPositions.xAxis.x.start;
        const xEndPoint = graphPositions.xAxis.x.start + (((graphPositions.yAxis.y.end - graphPositions.yAxis.y.start) / maxHackersOnSameServer) * (penetratedServers[numberOfServers]));
        const y = graphPositions.yAxis.y.end - (((graphPositions.yAxis.y.end - graphPositions.yAxis.y.start) / servers) * (numberOfServers));
        ctx.strokeStyle = "#ff0000";
        ctx.beginPath();
        ctx.moveTo(xStartPoint, y);
        ctx.lineTo(xEndPoint, y);
        ctx.stroke();
    }

    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(graphPositions.xAxis.x.start + (graphPositions.yAxis.y.end - graphPositions.yAxis.y.start), graphPositions.yAxis.y.end);
    ctx.lineTo(graphPositions.xAxis.x.start + (graphPositions.yAxis.y.end - graphPositions.yAxis.y.start), graphPositions.yAxis.y.start);
    ctx.stroke();
    ctx.fillText(maxHackersOnSameServer, graphPositions.xAxis.x.start + (graphPositions.yAxis.y.end - graphPositions.yAxis.y.start), graphPositions.yAxis.y.end + 20);
    ctx.setLineDash([]);
}