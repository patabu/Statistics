let chartGraphInstance = null;
let chartBarRelativeInstance = null;
let chartBarAbsoluteInstance = null;

function onExecute() {
    try {
        const { numberOfServers, numberOfAttackers, probability, intermediateStep } = getInputData();
        
        const penetrationsData = getDataForEMChart(numberOfServers, numberOfAttackers, probability);

        // drawDistributionChart(penetrationsData, numberOfServers, penetrationsData[0].data.length - 1, 'finalChart');
        drawEMChart(penetrationsData, numberOfServers);
        drawDistributionChart(penetrationsData, numberOfServers, intermediateStep, 'intermediateChart');
    } catch (error) {
        console.log(error);
    }
}

function getDataForEMChart(numberOfServers, numberOfAttackers, probability) {
    let penetrationsData = [];
    for (let attackerIndex = 0; attackerIndex < numberOfAttackers; attackerIndex++) {
        const penetrationData = {
            label: `H${attackerIndex + 1}`,
            data: [0],
            fill: false,
            borderColor: getRandomColor(),
            tension: 0,
            numberOfSuccessfulAttacks: 0,
            pointRadius: 0,
            borderWidth: .5
        }
        for (let serverIndex = 1; serverIndex <= numberOfServers; serverIndex++) {
            const isAttackSuccessful = Math.random() <= probability;
            if (isAttackSuccessful) penetrationData.numberOfSuccessfulAttacks++;
            penetrationData.data.push(penetrationData.data[serverIndex - 1] + (isAttackSuccessful ? 1 : -1));
        }
        penetrationsData.push(penetrationData);
    }
    return penetrationsData;
}

function drawEMChart(penetrationsData, numberOfServers, padding) {

    const canvas = document.getElementById('EMChart');
    const ctx = canvas.getContext('2d');

    let canvasHeight = canvas.height;
    console.log(canvasHeight);
    
    const spaceForRow = (canvasHeight / (numberOfServers * 2)) - (numberOfServers + 1)
    

    

    const data = {
        labels: Array.from({ length: Number(numberOfServers) + 1 }, (_, i) => i),
        datasets: penetrationsData,
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            layout: {
                padding: (spaceForRow / 2)
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: -numberOfServers,
                    max: parseFloat(numberOfServers),
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    display: false
                }
            }
        }
    };

    if (chartGraphInstance) {
        chartGraphInstance.destroy();
    }

    chartGraphInstance = new Chart(ctx, config);
}


function drawDistributionChart(penetrationsData, numberOfServers, step, chartName) {
    if (chartName === 'finalChart') {
        if (chartBarAbsoluteInstance) chartBarAbsoluteInstance.destroy();
        const canvas = document.getElementById(chartName);

        const data = getFData(penetrationsData, numberOfServers, step);

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                mantainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                }
            },
        };

        const ctx = canvas.getContext('2d');
        chartBarAbsoluteInstance = new Chart(ctx, config);
    } else if (chartName === 'intermediateChart') {
        if (chartBarRelativeInstance) chartBarRelativeInstance.destroy();

        const canvas = document.getElementById(chartName);

        // * Calcolo la posizione orizzontale per le barre intermedie
        const chartArea = chartGraphInstance.chartArea;
        console.log(chartArea);
        
        const chartWidth = chartArea.right - chartArea.left;
        const relativeLeft = step / numberOfServers * chartWidth;
        const left = chartArea.left + relativeLeft;
        canvas.style.left = left + 'px';

        const chartHeight = chartArea.bottom - chartArea.top; // * Calcolo la posizione verticale per le barre intermedie
    
        const barThickness = chartHeight / ((numberOfServers * 2) * 2); // * Rappresenta la grandezza di una barra

        const data = getFData(penetrationsData, numberOfServers, step);
    
        const config = {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { 
                        display: false,
                        offset: 2
                    }
                }
            },
        };

        const ctx = canvas.getContext('2d');
        chartBarRelativeInstance = new Chart(ctx, config);
        return barThickness;
    }
}

function drawRFChart() {
    const data2 = {
        labels: penetrationsData.map(attacker => attacker.label),
        datasets: [{
        //   label: 'Relative frequency',
          data: data.datasets[0].data.map(value => value / numberOfServers),
          backgroundColor: penetrationsData.map(attacker => {
              const color = attacker.borderColor;
              return color.slice(0, 3) + 'a' + color.slice(3, color.length - 1) + ', 0.4)';
          }),
          borderColor: penetrationsData.map(attacker => attacker.borderColor),
          borderWidth: 1
        }]
    };

    const config2 = {
        type: 'bar',
        data: data2,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Relative frequency'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                beginAtZero: true,
                max: 1
                }
            }
        },
    }

    if (chartBarRelativeInstance) {
        chartBarRelativeInstance.destroy();
    }

    const canvas2 = document.getElementById('RFChart');
    const ctx2 = canvas2.getContext('2d');
    chartBarRelativeInstance = new Chart(ctx2, config2);
}

function getRandomColor() {
    var r = Math.floor(Math.random() * 256); // Valore rosso
    var g = Math.floor(Math.random() * 256); // Valore verde
    var b = Math.floor(Math.random() * 256); // Valore blu
    return 'rgb(' + r + ', ' + g + ', ' + b + ')'; // Restituisce il colore in formato RGB
}

function getOldInputData() {
    const numberOfServers = document.getElementById("servers").value;
    const numberOfAttackers = document.getElementById("attackers").value;
    const probability = document.getElementById("probability").value;
    return { numberOfServers, numberOfAttackers, probability };
}

function getInputData() {
    const numberOfServers = Number(
        document.getElementById("servers").value);
    if (numberOfServers <= 0) {
        window.alert("Servers must be at least 1");
        throw Error("Servers must be at least 1");
    }
    const numberOfAttackers = Number(document.getElementById("attackers").value);
    if (numberOfAttackers <= 0) {
        window.alert("Attackers must be at least 1");
        throw Error("Attackers must be at least 1");
    }
    const probability = Number(document.getElementById("probability").value);
    if (probability <= 0 || probability >= 1) {
        window.alert("Probability must be between 0 and 1 excluded")
        throw Error("Probability must be between 0 and 1 excluded");
    }
    const intermediateStep = Number(document.getElementById("intermediateStep").value);    
    if (intermediateStep < 1 || intermediateStep >= numberOfServers) {
        window.alert('The intermediate step must be between 1 and ' + numberOfServers + ' excluded');
        throw Error('The intermediate step must be between 1 and ' + numberOfServers + ' excluded');
    }
    return { numberOfServers, numberOfAttackers, probability, intermediateStep };
}

document.addEventListener("keydown", function(event) {
    // Ottengo il nome del tasto premuto
    const key = event.key;
    if (key === 'Enter' || key === 'Space' || key === ' ') onExecute();
});

function getFData(penetrationsData, numberOfServers, step) {
    let arr = new Array((numberOfServers * 2) + 1).fill(0);

    for (let index = 0; index < penetrationsData.length; index++) {
        let dataArray = penetrationsData[index].data;
        let indexNewArray = numberOfServers - dataArray[step];      
        arr[indexNewArray]++;
    }
    

    const data = {
      labels: Array.from({ length: Number(numberOfServers * 2) + 1 }, (_, i) => i),
      datasets: [{
        label: 'Step ' + step,
        data: arr,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderColor: 'rgb(100, 100, 100)',
        borderWidth: 1,
        borderSkipped: false
      }]
    };

    return data;
}