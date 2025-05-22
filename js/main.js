// File: js/main.js
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import CreditsScene from './scenes/CreditsScene.js';
import GameScene from './scenes/GameScene.js';
import InventoryScene from './scenes/InventoryScene.js';
import SellerScene from './scenes/SellerScene.js';
import PauseMenuScene from './scenes/PauseMenuScene.js';

const DESIGN_WIDTH = 1024; const DESIGN_HEIGHT = 768;
const config = {
    type: Phaser.AUTO, parent: 'game-container', backgroundColor: '#000000', pixelArt: true,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: DESIGN_WIDTH, height: DESIGN_HEIGHT, },
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scene: [ BootScene, PreloadScene, MainMenuScene, CreditsScene, GameScene, InventoryScene, SellerScene, PauseMenuScene ]
};
const game = new Phaser.Game(config);
