// File: js/scenes/MainMenuScene.js
export default class MainMenuScene extends Phaser.Scene {
    constructor() { super({ key: 'MainMenuScene' }); this.saveSlotsUI = null; }
    preload() { console.log('MainMenuScene: preload'); }

    create() {
        console.log('MainMenuScene: create'); this.cameras.main.setBackgroundColor('#3d550c');
        this.add.text(this.cameras.main.width/2,this.cameras.main.height*0.15,'Flora Collector',{font:'48px Arial',fill:'#fff',stroke:'#000',strokeThickness:6}).setOrigin(0.5);
        const cX=this.cameras.main.width/2; let cY=this.cameras.main.height*0.35; const bSc=2.0; const bSpY=(16*bSc)+35;
        const createBtn=(y,txt,cb,scale=bSc)=>{const bS=this.add.sprite(cX,y,'button_wood_normal').setInteractive({useHandCursor:true}).setScale(scale);const bT=this.add.text(bS.x,bS.y,txt,{font:`${10*scale}px Arial`,fill:'#402808',align:'center'}).setOrigin(0.5);bS.on(Phaser.Input.Events.POINTER_OVER,()=>bS.setTexture('button_wood_hover'));bS.on(Phaser.Input.Events.POINTER_OUT,()=>bS.setTexture('button_wood_normal'));bS.on(Phaser.Input.Events.POINTER_DOWN,()=>bS.setTexture('button_wood_clicked'));bS.on(Phaser.Input.Events.POINTER_UP,()=>{if(bS.getBounds().contains(this.input.activePointer.x,this.input.activePointer.y)){bS.setTexture('button_wood_hover');}else{bS.setTexture('button_wood_normal');}if(cb)this.time.delayedCall(100,cb,[],this);});return bS;};
        
        createBtn(cY,"New Game",()=>this.showWorldNamePopup(), bSc + 0.2); cY+=bSpY;
        createBtn(cY,"Load Game",()=>this.showLoadSlots()); cY+=bSpY*1.5; // More space for slots panel
        createBtn(cY,"Settings",()=>alert('Settings TBD.')); cY+=bSpY;
        createBtn(cY,"Credits",()=>this.scene.start('CreditsScene'));

        let music=this.sound.get('bg_music_main');if(!music||!music.isPlaying){try{this.sound.play('bg_music_main',{loop:true,volume:0.3});}catch(e){console.warn("Music fail.",e);}}
    }
    showWorldNamePopup(slotToSaveTo=null){if(this.saveSlotsUI&&this.saveSlotsUI.active){this.saveSlotsUI.destroy();this.saveSlotsUI=null;}const wN=prompt("Enter world name:","My Flora World");if(wN&&wN.trim()!==""){let sD={isNewGame:true,worldName:wN};if(slotToSaveTo)sD.saveToSlotOnStart=slotToSaveTo;this.scene.start('GameScene',sD);}else{console.log("New game cancelled.");}}
    showLoadSlots(){
        if(this.saveSlotsUI&&this.saveSlotsUI.active){this.saveSlotsUI.destroy();this.saveSlotsUI=null;return;}
        this.saveSlotsUI=this.add.group();const cX=this.cameras.main.width/2;
        const pW=this.cameras.main.width*0.7,pH=320,pX=cX-pW/2,pY=this.cameras.main.height*0.32;
        const pBg=this.add.rectangle(pX,pY,pW,pH,0x2a2010,0.95).setOrigin(0,0).setStrokeStyle(3,0x1a1005);this.saveSlotsUI.add(pBg);
        const title=this.add.text(cX,pY+30,'Select Save Slot',{font:'24px Arial',fill:'#f0e0d0'}).setOrigin(0.5);this.saveSlotsUI.add(title);
        const sBS=1.8,sBH=16*sBS,sBW=48*sBS,nS=5,sSY=pY+80,sSpY=sBH+20;
        for(let i=0;i<nS;i++){const sK=`floraCollector_saveSlot_${i+1}`;const sDS=localStorage.getItem(sK);let sT=`Slot ${i+1}: <Empty>`;let hD=false;if(sDS){try{const sD=JSON.parse(sDS);sT=`Slot ${i+1}: ${sD.worldName||'Saved'}`;hD=true;}catch(e){}}
            const sY=sSY+i*sSpY;const sBtn=this.add.sprite(cX,sY,'button_wood_normal').setInteractive({useHandCursor:true}).setScale(sBS).setData('sK',sK).setData('hD',hD);this.saveSlotsUI.add(sBtn);
            const sL=this.add.text(sBtn.x,sBtn.y,sT,{font:`${9*sBS}px Arial`,fill:'#402808',align:'center'}).setOrigin(0.5);if(!hD)sL.setAlpha(0.6);this.saveSlotsUI.add(sL);
            sBtn.on(Phaser.Input.Events.POINTER_OVER,()=>sBtn.setTexture('button_wood_hover'));sBtn.on(Phaser.Input.Events.POINTER_OUT,()=>sBtn.setTexture('button_wood_normal'));sBtn.on(Phaser.Input.Events.POINTER_DOWN,()=>sBtn.setTexture('button_wood_clicked'));
            sBtn.on(Phaser.Input.Events.POINTER_UP,()=>{if(sBtn.getBounds().contains(this.input.activePointer.x,this.input.activePointer.y)){sBtn.setTexture('button_wood_hover');}else{sBtn.setTexture('button_wood_normal');}if(sBtn.getData('hD')){this.time.delayedCall(100,()=>{if(this.saveSlotsUI){this.saveSlotsUI.destroy();this.saveSlotsUI=null;}this.scene.start('GameScene',{loadSlotKey:sBtn.getData('sK'),isNewGame:false});},[],this);}else{if(this.saveSlotsUI){this.saveSlotsUI.destroy();this.saveSlotsUI=null;}this.showWorldNamePopup(i+1);}});
        }
        const cSB=this.add.text(pX+pW-20,pY+20,"X",{font:"20px Arial",fill:"#fff",backgroundColor:"#800",padding:{x:5}}).setOrigin(1,0).setInteractive({useHandCursor:true});cSB.on('pointerdown',()=>{if(this.saveSlotsUI){this.saveSlotsUI.destroy();this.saveSlotsUI=null;}});this.saveSlotsUI.add(cSB);
    }
}
