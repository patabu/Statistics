const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const lettersEnglishFrequency  = ['E', 'T', 'A', 'O', 'I', 'N', 'S', 'H', 'R', 'D', 'L', 'C', 'U', 'M', 'W', 'F', 'G', 'Y', 'P', 'B', 'V', 'K', 'J', 'X', 'Q', 'Z'];

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 200;

const graph1Positions = {
    xStart: canvas.width * 0.05,
    xEnd: canvas.width * 0.48,
    yStart: canvas.height * 0.05,
    yEnd: canvas.height * 0.9
}

const graph2Positions = {
    xStart: canvas.width * 0.52,
    xEnd: canvas.width * 0.95,
    yStart: canvas.height * 0.05,
    yEnd: canvas.height * 0.9
}

function clearChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawChartAxis(graphPositions) {
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

function drawChartLines(frequencyDatas, graphPositions, isCiphered) {
    const spacePerFrequency = (graphPositions.xEnd - graphPositions.xStart) / frequencyDatas.length;

    const higherFrequency = Math.max(...frequencyDatas.map(frequencyData => frequencyData.frequency));
    const frequencyQuantityPerSpace = higherFrequency / 10;
    
    const graphHeight = graphPositions.yEnd - graphPositions.yStart;
    const verticalSpacePerFrequencyPortion = graphHeight / 10;

    const padding = spacePerFrequency / 8;
    const frequencyWidth = spacePerFrequency - (2 * padding);
    for (let frequencyIndex = 0; frequencyIndex < frequencyDatas.length; frequencyIndex++) {
        ctx.beginPath();
        ctx.fillStyle = isCiphered ? "#ff66cc" : "#3385ff";
        ctx.rect(
            (graphPositions.xStart + (frequencyIndex * spacePerFrequency)) + padding,
            graphPositions.yEnd - 1,
            frequencyWidth,
            -((frequencyDatas[frequencyIndex].frequency / higherFrequency) * graphHeight)
        );
        ctx.fill();
        
        ctx.fillStyle = "#000000";
        ctx.fillText(frequencyDatas[frequencyIndex].letter, (graphPositions.xStart + (frequencyIndex * spacePerFrequency) + (spacePerFrequency / 2) - 3), graphPositions.yEnd + 15)
    }

    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";

    ctx.strokeStyle = "#9ca0a6";
    ctx.lineWidth = .5;
    for (let indexProbability = 1; indexProbability < frequencyDatas.length; indexProbability++) {
        ctx.beginPath();
        ctx.moveTo(graphPositions.xStart + (spacePerFrequency * indexProbability), graphPositions.yStart);
        ctx.lineTo(graphPositions.xStart + (spacePerFrequency * indexProbability), graphPositions.yEnd);
        ctx.stroke();
    }

    for (let horizontalRowIndex = 0; horizontalRowIndex < 10; horizontalRowIndex++) {
        const y = graphPositions.yStart + (verticalSpacePerFrequencyPortion * horizontalRowIndex)
        ctx.beginPath();
        ctx.moveTo(graphPositions.xStart, y);
        ctx.lineTo(graphPositions.xEnd, y);
        ctx.stroke();
        ctx.fillText(Math.round(higherFrequency - (frequencyQuantityPerSpace * horizontalRowIndex)), graphPositions.xStart - 25, y);
    }

}

function applyRandomCeaserCipher(textToCipher) {
    const random = Math.floor(Math.random() * 26);
    
    const textCiphered = textToCipher.split('').map(letter => {
        const charCode = letter.charCodeAt(0);
        if (charCode >= 65 && charCode <= 90) {
            return String.fromCharCode((charCode - 65 + random) % 26 + 65);
        } else if (charCode >= 97 && charCode <= 122) {
            return String.fromCharCode((charCode - 97 + random) % 26 + 97);
        }
        return letter;
    }).join('');    
    return textCiphered;
}

function decipherRandomCeaserCipher(textCiphered, orderedFrequencyCipheredText) {
    let randomShift = orderedFrequencyCipheredText[0].letter.charCodeAt(0) - 69;

    const textDeciphered = textCiphered.split('').map(letter => {   
        const charCode = letter.charCodeAt(0);        
        if (charCode >= 65 && charCode <= 90) {
            return String.fromCharCode((charCode - 65 + 26 - randomShift) % 26 + 65);
        } else if (charCode >= 97 && charCode <= 122) {
            return String.fromCharCode((charCode - 97 + 26 - randomShift) % 26 + 97);
        }
        return letter;
    }).join('');
    return textDeciphered;
}

function calculateLettersFrequency(textToCipher) {
    const lettersData = new Array(26).fill({ letter: '', frequency: 0 });
    for (let index = 0; index < lettersData.length; index++) {
        lettersData[index] = { letter: String.fromCharCode(65 + index), frequency: 0 };
    }
    for (let index = 0; index < textToCipher.length; index++) {
        const charCode = textToCipher.charCodeAt(index);
        if (charCode >= 65 && charCode <= 90) {
            lettersData[charCode - 65].frequency++;        
        } else if (charCode >= 97 && charCode <= 122) {
            lettersData[charCode - 97].frequency++;
        }
    }
    return lettersData;
}

function onExecute() {
    clearChart();
    drawChartAxis(graph1Positions);
    drawChartAxis(graph2Positions);
    const textToCipher = "Priya and the plumber from TimeTech Insurance company looked around at her flooded kitchen. She hadn't been to the house for weeks. A few months ago, she had moved back to live with her parents to save money because Charlie's hospital bills were so high. She had hoped to sell the house before this but, so far, no one had been interested. Someone was coming to see it tomorrow, the first person in four months. She really needed them to buy it, but no one would want it now. She guessed the water had been in the kitchen for ages because it smelled like old fish. 'Eww!' said Charlie at the horrible smell. He held his nose and made a silly face, the way five-year-olds do. And then he started to cough. But his thin body was too weak for the effort and he stopped. Priya felt even worse about the situation. She had called the plumber as soon as she saw the condition of the house. And right after that, she called her boss at the jewellery shop to say she couldn't work today. She was really good at her job and she sold lots of jewellery, but he would probably take money from her pay. Just one of those expensive necklaces would pay for Charlie's operation. It was so unfair! 'Do you mind if I look?' asked the plumber. 'Of course! Please, go in,' she replied. Luckily, the plumber was wearing boots that were about five centimetres higher than the water. He walked slowly towards the sink and opened the cupboard under it to look at the pipes. Then, he took a few photos of the flooded kitchen, one of them with her, Charlie and the dog in. Charlie made another silly face for the photo, which made him look even more pale and ill. 'Can you fix it?' she asked. She didn't have the money to pay someone to repair the kitchen, so she hoped the insurance company would do it. But TimeTech's slogan promised: Say goodbye to every* problem you ever had! Well, Priya definitely wanted to say goodbye to this problem. 'It's your lucky day,' he said, 'as long as the flood happened within the right time period. Now, to be sure, I need to go back two months. The pipe looks as if it's been like this for a while. But I think the flooding actually happened six weeks ago because of the way the water looks.' Priya shook her head in surprise. It was so hard to believe that this time travel stuff was real. 'Now, I just need to ask a few questions,' he said. He had a pen and paper to make notes, not some complicated machine like you might expect a time traveller to have. 'When did you sign up with TimeTech?' 'August 15,' she said. Her heart sank the moment the words were out of her mouth. 'Oh,' he said. 'That's only a month ago.' 'Oh no! Please don't say you can't fix it! I need to sell the house or I can't pay for Charlie's doctor and—' She began to cry, she couldn't stop herself. 'I had to take the morning off work to come here today and my boss isn't happy. Now he won't pay me for today, which is all I need.' 'We really can't go back to a time before the customer signed up with TimeTech,' he said, 'because it's really hard to make them believe that in the future they're going to be a customer. We tried it a few times but it always went badly.' 'Oh, I'm sure I'll believe you! I was thinking about signing up for a long time before I finally did it,' she said. 'Say goodbye to every problem you ever had, right? I certainly have a lot of problems!' She tried to laugh but, instead, she was almost crying again. Charlie hugged her legs. Maybe the plumber felt sorry for her or maybe he was just embarrassed but he said, 'You seem as if you're having a hard time so, OK, I'll do this for you.' He wrote down some more information, shaking his head. She knew that he was doing her a big favour. 'I'll be back in about half an hour to make sure you're happy with the work, OK?' The plumber walked back to the road and disappeared into his van. It was a very ordinary van and it didn't look like a time machine at all. The slogan Say goodbye to every* problem you ever had! was painted on the side of the van. It had a * next to some smaller writing underneath, but she couldn't read it from where she was. Obviously they couldn't wait in the disgusting, flooded kitchen so they sat outside. Charlie was too tired to run around the garden. Instead, he watched the dog trying to dig a hole next to the 'For Sale' sign. She went closer to the van and read the small writing under the slogan. *TimeTech only solves problems involving objects. We CANNOT change situations that happen because of people and their actions. Aaah, now she remembered! TimeTech had been in the news after twelve of their customers went to prison. TimeTech had now added * next to the word 'every' in their slogan. Just as she was looking at it, the van door opened. 'All fixed!' the plumber said, smiling. 'Was I surprised to see you?' Priya asked. 'Yes! At first, but that's why the photos are so useful. People always believe me when they see themselves in the pictures. You said you couldn't believe you were using TimeTech so soon after signing up.' 'Let's see! Let's see!' Charlie jumped up and down with a new energy. Priya opened the house door and, just like TimeTech promised, her problem was solved. The kitchen was dry, tidy and smelled normal. 'Wow!' said Charlie. Priya agreed. 'It's as though the flood never happened!' she said to the plumber. He laughed. 'It didn't happen!' he said. 'I put your new pipe in on 17 July and that solved the problem before it could happen. It would be more accurate to say the flood unhappened! But don't think about it too much. Time travel is confusing!' Priya shook her head. She couldn't believe what had just happened – or unhappened. July 17 Two months earlier, Priya was also shaking her head and she also couldn't believe what had just happened. In one way, of course, nothing extraordinary had happened. A plumber had fixed a pipe in a few minutes. Except the pipe wasn't broken – yet – and the plumber had come from the future. Well, she was glad that future Priya was going to sign up with TimeTech. She had heard a bit about them, but now she really understood what the company did. Say goodbye to every* problem you ever had! the slogan on the van outside her house had said. There was some smaller writing underneath, but she hadn't been close enough to read it. It was amazing – solve all your problems with time travel. She hadn't believed the plumber was telling the truth at first. But when he showed her the photo from the future she knew it was true. The photo showed Charlie looking so pale and thin. It broke her heart to see how much worse her little boy would get in the next two months. 'I've certainly got a lot of problems,' she thought. The biggest was money, of course. Since Charlie had got ill, she had spent all her money on doctors and medicine. But he still needed an operation and if he didn't get it … She didn't want to think about it. She had very little time and she needed money, a lot of it. Until today, she thought selling the house and moving in with her parents was the only way to get enough money to make Charlie better. But now, thanks to TimeTech, she had a better idea. She knew stealing was wrong, time travel didn't change that. 'But my boss is horrible to me,' she thought. 'And anyway, he's so rich he won't notice if a couple of hundred-thousand-pound necklaces disappear. And if I do get caught, well, TimeTech will make it unhappen and get me out of prison.' Maybe they would help her put the jewellery back or go back in time and show her a photo of herself in prison, or whatever it was they could do. She'd seen her kitchen with her own eyes! TimeTech's insurance was the best insurance you could ever have. September 17 As they waved the plumber goodbye, Charlie ran back into the garden. He played with the dog, who had found a ball in the kitchen. 'Where's the For Sale sign gone, Mum?' he asked. 'Did the plumber take it away?' 'Something like that,' said Priya. She smiled as she watched him running around. His legs were strong and his little fat face was pink. 'The operation was a success,' she thought. Her old worries were gone. But now that she had read the small writing on the TimeTech van, she had a new fear – that any moment the police would come and she would be the thirteenth person in prison. TimeTech couldn't solve every problem. She had been crazy to imagine they could. So far, it seemed as if her boss hadn't noticed the missing necklaces. She hoped her luck would last.";

    const initialTextFrequencyDatas = calculateLettersFrequency(textToCipher);
    drawChartLines(initialTextFrequencyDatas, graph1Positions, false);

    const textCiphered = applyRandomCeaserCipher(textToCipher);
    document.getElementById('textCiphered').innerText = textCiphered;
    const cipheredTextFrequencyDatas = calculateLettersFrequency(textCiphered);
    drawChartLines(cipheredTextFrequencyDatas, graph2Positions, true);

    const cipheredTextOrderedFrequencyDatas = cipheredTextFrequencyDatas.sort((a, b) => b.frequency - a.frequency);
    const decipheredRandomCeaserCipher = decipherRandomCeaserCipher(textCiphered, cipheredTextOrderedFrequencyDatas);
    
    document.getElementById('textDeciphered').innerText = decipheredRandomCeaserCipher;

}

