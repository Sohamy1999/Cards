
let game = {
    'you': {'span': '#your-result', 'div': '#your-box', 'score':0},
    'dealer': {'span': '#dealer-result', 'div': '#dealer-box', 'score':0},
    'cards':['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':[1,11]},
    'wins':0,
    'looses':0,
    'draws':0,
    'isStand':false,
    'overTurn':false,
};



const you = game['you']
const dealer = game['dealer']

const hitsound = new Audio('sounds/swish.m4a');
const winsound = new Audio('sounds/cash.mp3');
const loosesound = new Audio('sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click', blackjackhit);
document.querySelector('#deal').addEventListener('click', gameDeal);
document.querySelector('#stand').addEventListener('click', standLogic);
document.querySelector('#reset').addEventListener('click', reset);




function blackjackhit (){
    if(game['isStand'] === false ){
        let card = ramdomCard();
        showCard(card, you);
        updateScore(card, you);
        showScore(you);
    }
}

function ramdomCard(){
    let randomIndex=Math.floor(Math.random()*13);
    return game['cards'][randomIndex];
}

function showCard(card, activePlayer){
    if (activePlayer ['score'] <= 21){
        let cardImg = document.createElement('img');
        cardImg.src = `images/${card}.png` ;
        document.querySelector(activePlayer['div']).appendChild(cardImg);
        hitsound.play();
    }
    

}

function gameDeal(){

        game['isStand']=false;
        let yourImgs = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImgs = document.querySelector('#dealer-box').querySelectorAll('img');
        for(let i=0; i<yourImgs.length; i++){
            yourImgs[i].remove();

        }
        for(let i=0; i<dealerImgs.length; i++){
            dealerImgs[i].remove();
        }

        you['score'] = 0;
        dealer['score'] = 0;
        document.querySelector('#your-result').textContent = 0;
        document.querySelector('#dealer-result').textContent = 0;
        document.querySelector(you['span']).style.color = '#F0F8FF';
        document.querySelector(dealer['span']).style.color = '#F0F8FF';
        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'black';

        game['overTurn']=false;
    
}

function updateScore(card, activePlayer){
    if(card === 'A'){
        if (activePlayer['score']+game['cardsMap'][card][1] <=21){
            activePlayer['score'] += game['cardsMap'][card][1];
        }else{
            activePlayer['score'] += game['cardsMap'][card][0];
        }
    }else{
        activePlayer['score'] += game['cardsMap'][card];
    }
}

function showScore(activePlayer){
    if(activePlayer['score'] > 21){
        document.querySelector(activePlayer['span']).textContent = 'BUST!';
        document.querySelector(activePlayer['span']).style.color = 'red';
    }else{
        document.querySelector(activePlayer['span']).textContent = activePlayer['score'];
    }
}


function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}



async function standLogic (){
    if(you['score']>0){
        game['isStand'] = true;
        while(dealer['score']<=16 && game['isStand'] === true){
            let card = ramdomCard();
            showCard(card, dealer);
            updateScore(card, dealer);
            showScore(dealer);
            await sleep(1000);
        }

        game['overTurn']=true;
        let winner = computeWinner();
        showResult(winner);
    
    }
    }



function computeWinner(){
    let winner;

    if(you['score'] <= 21){
        if(you['score'] > dealer['score'] || (dealer['score'] > 21)){
            game['wins']++;
            winner = you;
        }else if(you['score'] < dealer['score']) {
            game['looses']++;
            winner=dealer;
        }else if(you['score'] === dealer['score']){
            game['draws']++;
        }
    }else if(you['score'] > 21 && (dealer['score'] <= 21)){
        game['looses']++;
        winner=dealer;
    }else if(you['score'] > 21 && (dealer['score'] > 21)){
        game['draws']++;
    }

    console.log('winner is ', winner);
    return winner;
}

function showResult(winner){
    let message, messageColor;

    if(game['overTurn']===true){
        if(winner === you){
            document.querySelector('#wins').textContent = game['wins'];
            message = 'YOU WON!';
            messageColor = 'green';
            winsound.play();
        }else if(winner === dealer){
            document.querySelector('#looses').textContent = game['looses'];
            message = 'YOU LOST!';
            messageColor = 'red';
            loosesound.play();
        }else{
            document.querySelector('#draws').textContent = game['draws'];
            message = 'DRAW!';
            messageColor = 'black';
        }
    
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
    }
    

    function reset(){
        let yourImgs = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImgs = document.querySelector('#dealer-box').querySelectorAll('img');
        for(let i=0; i<yourImgs.length; i++){
            yourImgs[i].remove();

        }
        for(let i=0; i<dealerImgs.length; i++){
            dealerImgs[i].remove();
        }
        document.querySelector('#your-result').textContent = 0;
        document.querySelector('#dealer-result').textContent = 0;
        document.querySelector(you['span']).style.color = '#F0F8FF';
        document.querySelector(dealer['span']).style.color = '#F0F8FF';
        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = 'black';
        document.querySelector('#wins').textContent = 0;
        document.querySelector('#looses').textContent = 0;
        document.querySelector('#draws').textContent = 0;
        you['score'] = 0;
        dealer['score'] = 0;
        game['wins']=0;
        game['looses']=0;
        game['draws']=0;
    }