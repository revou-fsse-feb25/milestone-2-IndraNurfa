var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { applyTransition, getRandomNumber, updateLeaderboard, getLeaderboard, } from './utils';
class RockPaperScissors {
    constructor() {
        // DOM Elements
        this.playerSpan = document.getElementById('player-choices');
        this.resultHeader = document.getElementById('result');
        this.scoreDisplay = document.getElementById('current-score');
        // Game Variables
        this.userChoices = 'none';
        this.currentScore = 0;
        this.currentUsername = localStorage.getItem('username') || 'Guest';
        this.leaderboardName = 'highScoreRPS';
        // Choices and Winning Conditions
        this.CHOICES = [
            { data: 'rock', color: '#FE2BF1' },
            { data: 'paper', color: '#00DFBA' },
            { data: 'scissors', color: '#0C7CEB' },
        ];
        this.WINNING_CONDITIONS = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper',
        };
        // Initialize Event Listeners
        this.initEventListeners();
    }
    // Generate a random choice for the computer
    generateRandomChoice() {
        const random = getRandomNumber(0, this.CHOICES.length);
        return this.CHOICES[random].data;
    }
    // Get the color associated with a choice
    getColor(choice) {
        const selectedChoice = this.CHOICES.find((item) => item.data === choice);
        return selectedChoice ? selectedChoice.color : '#000'; // Default to black if not found
    }
    // Determine the winner
    determineWinner(playerChoice, computerChoice) {
        const userColor = this.getColor(playerChoice);
        const computerColor = this.getColor(computerChoice);
        if (playerChoice === computerChoice) {
            return `It's a tie! You both chose <span style="color: ${userColor};">${playerChoice.toUpperCase()}</span>. Try Again!`;
        }
        if (this.WINNING_CONDITIONS[playerChoice] === computerChoice) {
            return `You win! <span style="color: ${userColor};">${playerChoice.toUpperCase()}</span> beats <span style="color: ${computerColor};">${computerChoice.toUpperCase()}</span>. Good Job!`;
        }
        return `You lose! <span style="color: ${computerColor};">${computerChoice.toUpperCase()}</span> beats <span style="color: ${userColor};">${playerChoice.toUpperCase()}</span>.`;
    }
    // Reset the game
    resetGame() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                username: this.currentUsername,
                score: this.currentScore,
            };
            yield updateLeaderboard(this.leaderboardName, data);
            yield getLeaderboard(this.leaderboardName);
            this.currentScore = 0;
            if (this.scoreDisplay)
                this.scoreDisplay.innerHTML = '';
        });
    }
    // Main game logic
    logicGame(userChoices) {
        const computerChoices = this.generateRandomChoice();
        console.log(`Computer chose: ${computerChoices.toUpperCase()}`);
        console.log(`You clicked: ${userChoices.toUpperCase()}`);
        const userColor = this.getColor(userChoices);
        const computerColor = this.getColor(computerChoices);
        const newText = `
            Player: <span style="color: ${userColor};">${userChoices.toUpperCase()}</span> 
            VS 
            Computer: <span style="color: ${computerColor};">${computerChoices.toUpperCase()}</span>`;
        if (this.playerSpan)
            applyTransition(this.playerSpan, newText, 200);
        const result = this.determineWinner(userChoices, computerChoices);
        console.log(result);
        if (this.resultHeader)
            applyTransition(this.resultHeader, result, 250);
        if (result.includes('win')) {
            this.currentScore += 10;
            const scoreText = `Current Score: ${this.currentScore}`;
            if (this.scoreDisplay)
                applyTransition(this.scoreDisplay, scoreText, 300);
        }
        else if (result.includes('lose') && this.currentScore > 0) {
            this.resetGame();
        }
    }
    // Handle user choices
    handleChoices(event) {
        const target = event.target;
        const choices = target.getAttribute('data-choices');
        this.userChoices = choices || 'none';
        if (this.userChoices === 'none') {
            alert('Please select a choice!');
            return;
        }
        this.logicGame(this.userChoices);
    }
    // Initialize event listeners
    initEventListeners() {
        document.querySelectorAll('.choices-btn').forEach((button) => {
            button.addEventListener('click', this.handleChoices.bind(this));
        });
    }
}
// Initialize the game
const game = new RockPaperScissors();
document.addEventListener('DOMContentLoaded', () => {
    getLeaderboard(game.leaderboardName);
});
