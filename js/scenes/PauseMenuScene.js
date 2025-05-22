// File: js/scenes/PauseMenuScene.js
export default class PauseMenuScene extends Phaser.Scene {
    constructor(){super({key:'PauseMenuScene'});this.gameSceneRef=null;}
    init(data){this.gameSceneRef = data.gameScene || this.scene.get('GameScene');} // Get gameScene from data or manager
    create(){
        this.add.rectangle(0,0,this.cameras.main.width,this.cameras.main.height,0x000000,0.6).setOrigin(0,0);
        const pW=300,pH=350,pX=(this.cameras.main.width-pW)/2,pY=(this.cameras.main.height-pH)/2;
        this.add.rectangle(pX,pY,pW,pH,0x54310A).setOrigin(0,0).setStrokeStyle(4,0x382207);
        this.add.text(pX+pW/2,pY+40,'Paused',{font:'32px Arial',fill:'#f0e0d0'}).setOrigin(0.5);
        const bYS=pY+100,bS=60;
        const bSt={font:'20px Arial',fill:'#f0e0d0',backgroundColor:'#7a4a13',padding:{x:10,y:5},fixedWidth:200,align:'center'};
        const bHSt={fill:'#fff',backgroundColor:'#9c601f'};
        const rB=this.add.text(pX+pW/2,bYS,'Return to Game',bSt).setOrigin(0.5).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.resumeGame()).on('pointerover',()=>rB.setStyle(bHSt)).on('pointerout',()=>rB.setStyle(bSt));
        const sB=this.add.text(pX+pW/2,bYS+bS,'Save Game',bSt).setOrigin(0.5).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.saveGame()).on('pointerover',()=>sB.setStyle(bHSt)).on('pointerout',()=>sB.setStyle(bSt));
        const stB=this.add.text(pX+pW/2,bYS+bS*2,'Settings',bSt).setOrigin(0.5).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.openSettings()).on('pointerover',()=>stB.setStyle(bHSt)).on('pointerout',()=>stB.setStyle(bSt));
        const mMB=this.add.text(pX+pW/2,bYS+bS*3,'Main Menu',bSt).setOrigin(0.5).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.goToMainMenu()).on('pointerover',()=>mMB.setStyle(bHSt)).on('pointerout',()=>mMB.setStyle(bSt));
        this.input.keyboard.on('keydown-ESC',this.resumeGame,this);
        this.events.on(Phaser.Scenes.Events.SHUTDOWN,this.shutdownListeners,this);
    }
    shutdownListeners(){if(this.input&&this.input.keyboard)this.input.keyboard.off('keydown-ESC',this.resumeGame,this);this.events.off(Phaser.Scenes.Events.SHUTDOWN,this.shutdownListeners,this);}
    resumeGame(){if(this.gameSceneRef){this.gameSceneRef.isPauseMenuOpen=false;if(this.gameSceneRef.scene.isPaused('GameScene'))this.gameSceneRef.scene.resume('GameScene');}this.scene.stop();}
    saveGame(){
        if(this.gameSceneRef&&typeof this.gameSceneRef.triggerSave==='function'){
            const slotToSave = parseInt(prompt("Save to which slot? (1-5)", "1"));
            if (!isNaN(slotToSave) && slotToSave >= 1 && slotToSave <= 5) {
                const success = this.gameSceneRef.triggerSave(slotToSave);
                const sT=this.add.text(this.cameras.main.width/2,this.cameras.main.height-30,success?"Game Saved!":"Save Failed.",{font:"18px Arial",fill:success?"#0f0":"#f00"}).setOrigin(0.5);this.time.delayedCall(1500,()=>sT.destroy());
            } else { alert("Invalid slot. Game not saved."); }
        } else { alert("Save function not ready."); }
    }
    openSettings(){alert("Settings (Audio) TBD!");}
    goToMainMenu(){if(this.gameSceneRef){if(this.gameSceneRef.scene.isPaused('GameScene')){this.gameSceneRef.scene.resume('GameScene');}this.gameSceneRef.scene.stop('GameScene');}this.scene.stop();this.scene.start('MainMenuScene');}
}
