// File: js/scenes/PreloadScene.js
import { ALL_FLORA_DATA } from '../FloraData.js';

export default class PreloadScene extends Phaser.Scene {
    constructor() { super({ key: 'PreloadScene' }); }

    preload() {
        const centerX = this.cameras.main.width / 2; const centerY = this.cameras.main.height / 2;
        const progressBar = this.add.graphics(); const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8); progressBox.fillRect(centerX - 160, centerY - 25, 320, 50);
        let loadingText = this.add.text(centerX, centerY - 50, 'Loading...', { font: '20px Arial',fill: '#ffffff'}).setOrigin(0.5);
        let percentText = this.add.text(centerX, centerY, '0%', { font: '18px Arial',fill: '#ffffff'}).setOrigin(0.5);
        let assetText = this.add.text(centerX, centerY + 50, '', { font: '18px Arial',fill: '#ffffff'}).setOrigin(0.5);
        this.load.on('progress', function(v){percentText.setText(parseInt(v*100)+'%');progressBar.clear();progressBar.fillStyle(0x76b900,1);progressBar.fillRect(centerX-150,centerY-15,300*v,30);});
        this.load.on('fileprogress',function(f){assetText.setText('Asset: '+f.key);});
        this.load.on('complete',function(){progressBar.destroy();progressBox.destroy();loadingText.destroy();percentText.destroy();assetText.destroy();this.scene.start('MainMenuScene');},this);

        this.load.image('Grass0', 'assets/tiles/Grass0.png');
        this.load.image('Grass1', 'assets/tiles/Grass1.png');
        this.load.image('Grass2', 'assets/tiles/Grass2.png');
        this.load.image('grass_alpine_0', 'assets/tiles/grass_alpine_0.png');
        this.load.image('grass_grotto_0', 'assets/tiles/grass_grotto_0.png');
        this.load.image('player_placeholder', 'assets/character/player_placeholder.png');

        let flowersToLoadCount = 0;
        if(Object.keys(ALL_FLORA_DATA).length > 0){
            for(const fId in ALL_FLORA_DATA){if(ALL_FLORA_DATA.hasOwnProperty(fId)){const f=ALL_FLORA_DATA[fId];if(f&&f.id&&f.imageKey){const nP=f.id.split('_')[1];if(!nP||isNaN(parseInt(nP))){console.warn(`Skip flower ID: ${f.id}`);continue;}const fN=`flower (${nP}).png`;const fP=`assets/flowers/${fN}`;this.load.image(f.imageKey,fP);flowersToLoadCount++;}else{console.warn(`Skip flora entry:`,f);}}}
        } else { console.warn("ALL_FLORA_DATA empty."); }
        console.log(`Preload: Queued ${flowersToLoadCount} flowers.`);

        this.load.image('button_wood_normal', 'assets/ui/button_wood_normal.png');
        this.load.image('button_wood_hover', 'assets/ui/button_wood_hover.png');
        this.load.image('button_wood_clicked', 'assets/ui/button_wood_clicked.png');
        this.load.audio('bg_music_main', ['assets/music/background_music.ogg', 'assets/music/background_music.mp3']);
    }
    create() { /* Handled by 'complete' event */ }
}
