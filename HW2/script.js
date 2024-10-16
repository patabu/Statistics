let chartGraphInstance = null;
let chartBarRelativeInstance = null;
let chartBarAbsoluteInstance = null;

function onExecute() {
    try {
        const { numberOfServers, numberOfAttackers, probability } = getInputData();
        
        const penetrationsData = getDataForEMChart(numberOfServers, numberOfAttackers, probability);

        drawEMChart(penetrationsData, numberOfServers);
        drawAFChart(penetrationsData, numberOfServers, numberOfAttackers);
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
            numberOfSuccessfulAttacks: 0
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

function drawEMChart(penetrationsData, numberOfServers) {
    const data = {
        labels: Array.from({ length: Number(numberOfServers) + 1 }, (_, i) => i),
        datasets: penetrationsData,
    };

    const config = {
        type: 'line',
        data: data,
        options: {
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
                }
            }
        }
    };

    if (chartGraphInstance) {
        chartGraphInstance.destroy();
    }

    const canvas = document.getElementById('EMChart');
    const ctx = canvas.getContext('2d');
    chartGraphInstance = new Chart(ctx, config);
}


function drawAFChart(penetrationsData, numberOfServers, numberOfAttackers) {
    
    let arr = new Array((numberOfServers * 2) + 1).fill(0);

    console.log(arr.length)
    
    

    for (let index = 0; index < penetrationsData.length; index++) {
        let dataArray = penetrationsData[index].data;
        let indexNewArray = numberOfServers - dataArray[dataArray.length - 1];      
        arr[indexNewArray]++;
    }   
    // arr[1] = 2;
    

    const data = {
      labels: Array.from({ length: Number(numberOfServers * 2) + 1 }, (_, i) => i),
      datasets: [{
        label: 'Absolute frequency',
        data: arr,
        backgroundColor: 'rgb(60, 226, 255)',
        borderColor: 'rgb(60, 226, 255)',
        borderWidth: 1,
        borderSkipped: false
      }]
    };



    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            mantainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                // title: {
                //     display: true,
                //     text: 'Absolute frequency'
                // },
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

    if (chartBarAbsoluteInstance) {
        chartBarAbsoluteInstance.destroy();
    }

    const canvas1 = document.getElementById('AFChart');
    const ctx1 = canvas1.getContext('2d');
    chartBarAbsoluteInstance = new Chart(ctx1, config);
    console.log((((numberOfServers * 2) + 1) / 200));
    chartBarAbsoluteInstance.canvas.parentNode.style.height = 610 - (2 / numberOfServers) + 'px';
    
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
    console.log(numberOfServers, intermediateStep);
    
    if (intermediateStep < 1 || intermediateStep >= numberOfServers) {
        window.alert('The intermediate step must be between 1 and ' + numberOfServers + ' excluded');
        throw Error('The intermediate step must be between 1 and ' + numberOfServers + ' excluded');
    }
    return { numberOfServers, numberOfAttackers, probability };
}

document.addEventListener("keydown", function(event) {
    // Ottengo il nome del tasto premuto
    const key = event.key;
    if (key === 'Enter' || key === 'Space' || key === ' ') onExecute();
});