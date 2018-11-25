import { Component, OnInit } from '@angular/core';
import { MF, GK, FW, DF, FUNC, MANAGERS } from './cards';
import { ChatService } from 'src/app/chat.service';
import { PLAYERS } from './players';

const NUMBER_TO_PICK = 13;

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  cardSources1row: string[];
  cardSources2row: string[];
  cardSources3row: string[];
  selectedCards: string[];

  isChoosingCards: boolean;
  isActiveTurn: boolean;

  fieldCards: string[];
  opponentFieldCards: string[];

  score: number;
  opponentScore: number;

  attackOpponentCards: string[];
  middleOpponentCards: string[];
  defenceOpponentCards: string[];
  gkOpponentCards: string[];

  attackCards: string[];
  middleCards: string[];
  defenceCards: string[];
  gkCards: string[];

  manager: string;
  opponentManager: string;

  onFieldCards: string[];

  gameEnded: boolean;
  won: boolean;

  wins: number;
  opponentWins: number;

  hasUsedManagerPowerUp: boolean;

  constructor(private chat: ChatService) {
    this.selectedCards = [];
    this.attackOpponentCards = [];
    this.middleOpponentCards = [];
    this.defenceOpponentCards = [];
    this.gkOpponentCards = [];
    this.attackCards = [];
    this.middleCards = [];
    this.defenceCards = [];
    this.gkCards = [];
    this.fieldCards = [];
    this.opponentFieldCards = [];
    this.isChoosingCards = true;
    this.isActiveTurn = false;
    this.score = 0;
    this.opponentScore = 0;
    this.gameEnded = false;
    this.won = false;
    this.wins = 0;
    this.opponentWins = 0;
    this.manager = '';
    this.opponentManager = '';
    this.hasUsedManagerPowerUp = false;

    this.chat.messages.subscribe(msg => {
      if (msg.type === 'startTurn')
        this.isActiveTurn = true;

      if (msg.type === 'addOpponentCard')
        this.addCardOnOpponentSide(msg.src);

      if (msg.type === 'roundEnded') {
        if (this.score > this.opponentScore) {
          this.wins++;
        } else {
            if (this.score < this.opponentScore)
              this.opponentWins++;
            else {
              this.wins++;
              this.opponentWins++;
            }
        }
        this.score = 0;
        this.opponentScore = 0;
      }

      if (msg.type === 'gameOver') {
        this.gameEnded = true;
        this.won = msg.win;
      }

      if (msg.type === 'manager') {
        this.opponentManager = msg.manager;
        console.log(this.opponentManager);
      }
    });
  }

  ngOnInit() {
    this.cardSources1row = this.getFWandMF();
    this.cardSources2row = this.getGKandDF();
    this.cardSources3row = this.getManagers();
    this.selectedCards.push(this.getRandomArbitrary(0, 2, 1).map((id) => { return '/assets/cardImages/' + FUNC[id]+'.png' })[0]);
  }

  getRandomArbitrary(min, max, count): number[] {
    let ids = [];
    let i = 0;
    while (i < count) {
      let id = Math.floor(Math.random() * (max - min + 1)) + min;
      if (ids.indexOf(id) === -1) {
        i = i + 1;
        ids.push(id);
      }
    }
    return ids;
  }

  endTurn() {
    this.isActiveTurn = false;
    // this.score = this.score + this.getManagerBoost(this.manager);
    // this.opponentScore = this.opponentScore + this.getOpponentManagerBoost(this.opponentManager);
    this.chat.sendMsg({ type: 'endTurn', score: this.score });
  }

  getGKandDF(): string[] {
    let result = [];
    result = result.concat(this.getRandomArbitrary(0, 8, 3).map((id) => { return '/assets/cardImages/' + GK[id]+'.png' }));
    result = result.concat(this.getRandomArbitrary(0, 29, 7).map((id) => { return '/assets/cardImages/' + DF[id]+'.png' }));
    return result;
  }

  getManagers() {
    let result = [];
    result = result.concat(this.getRandomArbitrary(0, 16, 3).map((id) => { return '/assets/cardImages/' + MANAGERS[id]+'.png' }));
    return result;
  }

  getFWandMF() {
    let result = [];
    result = result.concat(this.getRandomArbitrary(0, 29, 7).map((id) => { return '/assets/cardImages/' + MF[id]+'.png' }));
    result = result.concat(this.getRandomArbitrary(0, 29, 7).map((id) => { return '/assets/cardImages/' + FW[id]+'.png' }));
    return result;
  }

  pickCard($event) {
    if (this.selectedCards.indexOf($event) > -1 || this.isReady)
      return;

    this.selectedCards.push($event);
  }

  pickManager($event) {
    if (this.selectedCards.indexOf($event) > -1 || this.isReady || this.manager !== '')
      return;

    this.manager = $event;
    this.selectedCards.push($event);
  }

  removeCard($event) {
    if ($event.indexOf('Func_') >= 0 && this.isChoosingCards)
      return;

    if ($event === this.manager)
      this.manager = '';

    const idx = this.selectedCards.indexOf($event);
    this.selectedCards.splice(idx, 1);
  }

  public get isReady() {
    return this.selectedCards.length === NUMBER_TO_PICK;
  }

  public getName(source) {
    let words = source.split('/');
    return words[3].split('.')[0];
  }

  startGame() {
    this.isChoosingCards = false;
    this.chat.sendMsg({
      type: 'choseCards',
      manager: this.manager
    })
  }

  public getAttackOfCard(src) {
    const p = PLAYERS.find(p => p.name === this.getName(src));
    if (!p)
      return -1;

    return p.att;
  }

  public getDefOfCard(src) {
    const p = PLAYERS.find(p => p.name === this.getName(src));
    if (!p)
      return -1;

    return p.def
  }

  addCardOnOpponentSide(source: string) {
    console.log(source);
    const player = PLAYERS.find(p => p.name === this.getName(source));
    this.opponentScore = this.opponentScore + player.att + player.def + this.getOpponentSamePlayerNationality(player);
    this.addPlayerToOpponentFieldArray(source, player);
  }

  addCardToPlay(card: string) {
    if (!this.isActiveTurn)
      return;

    if (card.indexOf('Func_') >= 0)
      this.processFunctionalCard(card);

    if (card.indexOf('_1') >= 0 || card.indexOf('_2') >= 0)
      this.processManagerCard(card);

    const player = PLAYERS.find(p => p.name === this.getName(card));
    this.score = this.score + player.att + player.def + this.getSamePlayerNationality(player);
    this.removeCard(card);
    this.addPlayerToFieldArray(card, player);
    this.chat.sendMsg({ type: 'addedCard', src: card});
  }

  processFunctionalCard(card) {
    if (this.hasUsedManagerPowerUp)
      return;

    this.hasUsedManagerPowerUp = true;
    this.removeCard(card);
    if (card.indexOf('gold') >= 0) {
      const player = PLAYERS.find(p => p.name === this.getName('/assets/cardImages/Neymar.png'));
      this.score = this.score + player.att + player.def + this.getSamePlayerNationality(player);
      this.addPlayerToFieldArray('/assets/cardImages/Neymar.png', player);
      this.chat.sendMsg({ type: 'addedCard', src: '/assets/cardImages/Neymar.png'});
    }
    if (card.indexOf('silver') >= 0) {
      const player = PLAYERS.find(p => p.name === this.getName('/assets/cardImages/Joao Moutinho.png'));
      this.score = this.score + player.att + player.def + this.getSamePlayerNationality(player);
      this.addPlayerToFieldArray('/assets/cardImages/Joao Moutinho.png', player);
      this.chat.sendMsg({ type: 'addedCard', src: '/assets/cardImages/Joao Moutinho.png'});
    }
      
    if (card.indexOf('bronze') >= 0) {
      const player = PLAYERS.find(p => p.name === this.getName('/assets/cardImages/Mercado.png'));
      this.score = this.score + player.att + player.def + this.getSamePlayerNationality(player);
      this.addPlayerToFieldArray('/assets/cardImages/Mercado.png', player);
      this.chat.sendMsg({ type: 'addedCard', src: '/assets/cardImages/Mercado.png'});
    }     
  }

  processManagerCard(card) {
    if (card.indexOf('_1') >= 0) {
      const player = PLAYERS.find(p => p.name === this.getName('/assets/cardImages/Messi.png'));
      this.score = this.score + player.att + player.def + this.getSamePlayerNationality(player);
      this.addPlayerToFieldArray('/assets/cardImages/Messi.png', player);
      this.chat.sendMsg({ type: 'addedCard', src: '/assets/cardImages/Messi.png'});
    }

    if (card.indexOf('_2') >= 0) {
      const player = PLAYERS.find(p => p.name === this.getName('/assets/cardImages/Ronaldo.png'));
      this.score = this.score + player.att + player.def + this.getSamePlayerNationality(player);
      this.addPlayerToFieldArray('/assets/cardImages/Ronaldo.png', player);
      this.chat.sendMsg({ type: 'addedCard', src: '/assets/cardImages/Ronaldo.png'});
    }
  }

  getManagerBoost(card) {
    let words = card.split('_');
    if (card.indexOf('_2') >= 0) {
      return this.attackCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === words[0].nationality).length;
    } else {
      return this.defenceCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === words[0].nationality).length;
    }     
  }

  getOpponentManagerBoost(card) {
    let words = card.split('_');
    if (card.indexOf('_2') >= 0) {
      return this.attackOpponentCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === words[0].nationality).length;
    } else {
      return this.defenceOpponentCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === words[0].nationality).length;
    }     
  }


  getSamePlayerNationality(player) {
    return this.attackCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === player.nationality).length +
      this.middleCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === player.nationality).length +
      this.defenceCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === player.nationality).length + 
      this.gkCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === player.nationality).length;
  }

  getOpponentSamePlayerNationality(player) {
    return this.attackOpponentCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === player.nationality).length +
      this.middleOpponentCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === player.nationality).length +
      this.defenceOpponentCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === player.nationality).length + 
      this.gkOpponentCards.map(c => PLAYERS.find(p => p.name === this.getName(c))).filter(p => p.nationality === player.nationality).length;
  }

  addPlayerToFieldArray(card: string, player) {
    if (player.position === 'GK')
      this.gkCards.push(card);

    if (player.position === 'DF')
      this.defenceCards.push(card);

    if (player.position === 'MF')
      this.middleCards.push(card);

    if (player.position === 'FW')
      this.attackCards.push(card);
  }

  addPlayerToOpponentFieldArray(card: string, player) {
    if (player.position === 'GK')
      this.gkOpponentCards.push(card);

    if (player.position === 'DF')
      this.defenceOpponentCards.push(card);

    if (player.position === 'MF')
      this.middleOpponentCards.push(card);

    if (player.position === 'FW')
      this.attackOpponentCards.push(card);
  }
}