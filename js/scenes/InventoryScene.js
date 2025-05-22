// File: js/scenes/InventoryScene.js
import { ALL_FLORA_DATA } from '../FloraData.js';

export default class InventoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InventoryScene' });
        this.inventoryData = {}; this.hotbarData = []; this.parentGameScene = null;
        this.slotsPerRow = 5; this.rows = 3; this.cellSize = 70; this.padding = 12; this.itemIconSize = 52;
        this.graphics = null; this.itemDisplayObjects = []; this.cellBgs = [];
        this.closeButton = null; this.escKey = null; this.eKey = null;
    }

    init(data) {
        this.inventoryData = data.inventory || {}; this.hotbarData = data.hotbar || [];
        this.parentGameScene = data.gameScene;
        this.itemDisplayObjects.forEach(obj => obj.destroy()); this.itemDisplayObjects = [];
        this.cellBgs = new Array(this.rows * this.slotsPerRow).fill(null);
    }

    create() {
        this.add.rectangle(0,0,this.cameras.main.width,this.cameras.main.height,0x000000,0.75).setOrigin(0,0);
        const panelW=(this.cellSize*this.slotsPerRow)+(this.padding*(this.slotsPerRow+1));const panelH=(this.cellSize*this.rows)+(this.padding*(this.rows+1))+70;
        const panelX=(this.cameras.main.width-panelW)/2;const panelY=(this.cameras.main.height-panelH)/2;
        this.add.rectangle(panelX,panelY,panelW,panelH,0x4a3b2a).setOrigin(0,0).setStrokeStyle(3,0x2d2010);
        this.add.text(panelX+panelW/2,panelY+35,'Flora Pouch',{font:'32px Arial',fill:'#e0d0b0',stroke:'#2d2010',strokeThickness:3}).setOrigin(0.5);
        this.graphics=this.add.graphics(); this.refreshDisplay(this.inventoryData,this.hotbarData);
        this.escKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC); this.eKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.closeButton=this.add.text(panelX+panelW-25,panelY+25,'X',{font:'28px Arial',fill:'#e0d0b0',backgroundColor:'#8c0000',padding:{x:8,y:3},fixedWidth:36,fixedHeight:36,align:'center'}).setOrigin(0.5).setInteractive({useHandCursor:true});
        this.closeButton.on('pointerdown',()=>this.closeInventory());
        this.closeButton.on('pointerover',()=>this.closeButton.setBackgroundColor('#c00000'));
        this.closeButton.on('pointerout',()=>this.closeButton.setBackgroundColor('#8c0000'));
    }

    update() { if(Phaser.Input.Keyboard.JustDown(this.escKey)||Phaser.Input.Keyboard.JustDown(this.eKey)){this.closeInventory();}}

    refreshDisplay(currentInventory, currentHotbar) {
        this.inventoryData = currentInventory; this.hotbarData = currentHotbar;
        this.graphics.clear(); this.itemDisplayObjects.forEach(obj=>obj.destroy()); this.itemDisplayObjects=[];
        this.cellBgs = new Array(this.rows*this.slotsPerRow).fill(null);
        const pX=(this.cameras.main.width-((this.cellSize*this.slotsPerRow)+(this.padding*(this.slotsPerRow+1))))/2;
        const pY=(this.cameras.main.height-((this.cellSize*this.rows)+(this.padding*(this.rows+1))+70))/2;
        const sX=pX+this.padding;const sY=pY+this.padding+70;
        let cInvSlotIdx=0;const fIdsInInv=Object.keys(this.inventoryData);
        for(let r=0;r<this.rows;r++){ for(let c=0;c<this.slotsPerRow;c++){
            const x=sX+c*(this.cellSize+this.padding);const y=sY+r*(this.cellSize+this.padding);
            const cellBg=this.add.rectangle(x+this.cellSize/2,y+this.cellSize/2,this.cellSize,this.cellSize,0x2d2010).setStrokeStyle(2,0x6a553b).setInteractive({useHandCursor:true}).setData('slotIndex',cInvSlotIdx).setData('floraId',null);
            this.itemDisplayObjects.push(cellBg);this.cellBgs[cInvSlotIdx]=cellBg;
            const fIdForCell=fIdsInInv[cInvSlotIdx];
            if(fIdForCell&&this.inventoryData[fIdForCell]){
                cellBg.setData('floraId',fIdForCell);const cnt=this.inventoryData[fIdForCell];const fMD=ALL_FLORA_DATA[fIdForCell];
                if(fMD&&fMD.imageKey){ try{
                    const iI=this.add.sprite(x+this.cellSize/2,y+this.cellSize/2,fMD.imageKey).setDisplaySize(this.itemIconSize,this.itemIconSize).setOrigin(0.5);this.itemDisplayObjects.push(iI);
                    const cT=this.add.text(x+this.cellSize-7,y+this.cellSize-7,`${cnt}`,{font:'18px Arial',fill:'#fff',stroke:'#000',strokeThickness:3,align:'right'}).setOrigin(1,1);this.itemDisplayObjects.push(cT);
                }catch(e){console.error("Err display item:",fIdForCell,e);}}
            }
            cellBg.on(Phaser.Input.Events.POINTER_DOWN,(ptr)=>{if(ptr.leftButtonDown()){this.handleInventoryCellClick(cellBg.getData('slotIndex'),cellBg.getData('floraId'));}});
            cInvSlotIdx++;
        }}
    }

    handleInventoryCellClick(slotIndex, floraIdInCell) {
        if(!this.parentGameScene)return; this.parentGameScene.clearSelectionVisuals();
        const gameSelItem=this.parentGameScene.selectedItem;
        if(gameSelItem){
            if(gameSelItem.from==='hotbar'){
                const itemFromHB={...gameSelItem};
                this.parentGameScene.hotbar[itemFromHB.originalIndex]=null;
                if(floraIdInCell&&this.inventoryData[floraIdInCell]){
                    this.parentGameScene.hotbar[itemFromHB.originalIndex]={floraId:floraIdInCell,count:this.inventoryData[floraIdInCell]};
                    delete this.inventoryData[floraIdInCell];
                }
                this.inventoryData[itemFromHB.floraId]=(this.inventoryData[itemFromHB.floraId]||0)+itemFromHB.count;
                if(this.inventoryData[itemFromHB.floraId]>this.parentGameScene.maxStack)this.inventoryData[itemFromHB.floraId]=this.parentGameScene.maxStack;
            }else if(gameSelItem.from==='inventory'){
                if(gameSelItem.originalFloraId===floraIdInCell&&floraIdInCell!==null){this.parentGameScene.selectedItem=null;this.refreshDisplay(this.inventoryData,this.hotbarData);return;}
                if(floraIdInCell&&this.inventoryData[floraIdInCell]){
                    this.parentGameScene.selectedItem={from:'inventory',floraId:floraIdInCell,count:this.inventoryData[floraIdInCell],originalFloraId:floraIdInCell};
                    if(this.cellBgs[slotIndex])this.cellBgs[slotIndex].setStrokeStyle(3,0xFFFF00,1);return;
                }
            }
            this.parentGameScene.selectedItem=null;
        }else{
            if(floraIdInCell&&this.inventoryData[floraIdInCell]){
                this.parentGameScene.selectedItem={from:'inventory',floraId:floraIdInCell,count:this.inventoryData[floraIdInCell],originalFloraId:floraIdInCell};
                if(this.cellBgs[slotIndex])this.cellBgs[slotIndex].setStrokeStyle(3,0xFFFF00,1);
            }
        }
        this.parentGameScene.refreshHotbarDisplay();this.refreshDisplay(this.inventoryData,this.hotbarData);
    }
    
    clearSelectionVisuals() { this.cellBgs.forEach(cellBG=>{if(cellBG)cellBG.setStrokeStyle(2,0x6a553b);});}
    closeInventory() { if(this.parentGameScene&&typeof this.parentGameScene.inventoryClosed==='function'){this.parentGameScene.inventoryClosed();}this.scene.stop();}
}
