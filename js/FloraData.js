// File: js/FloraData.js

function generateFlowerEntry(index, biomeType, rarityScore, basePriceVal) {
    const biomeNames = { main: "Meadow", upper: "Alpine", lower: "Grotto" };
    const rarityAdjectives = { 1: "Common", 2: "Uncommon", 3: "Choice", 4: "Rare", 5: "Mythic" };
    const colorHints = ["Veridian", "Azure", "Ruby", "Golden", "Silver", "Obsidian", "Pearl", "Emerald", "Sapphire", "Garnet"];
    const shapeHints = ["Petal", "Bloom", "Sprout", "Thorn", "Leaf", "Stalk", "Bell", "Crest", "Star", "Whisper"];
    const color = colorHints[index % colorHints.length];
    const shape = shapeHints[Math.floor(index / colorHints.length) % shapeHints.length];
    const xpValue = Math.ceil(basePriceVal / 2) + rarityScore * 2;
    let levelToBuy = 0; // For buying from seller, not biome unlock
    if (biomeType === 'main') { if (rarityScore >= 3) levelToBuy = 1; }
    else if (biomeType === 'upper') { levelToBuy = 2 + rarityScore; }
    else if (biomeType === 'lower') { levelToBuy = 3 + rarityScore; }
    levelToBuy = Math.min(levelToBuy, 8);

    return {
        id: `flower_${index}`,
        name: `${rarityAdjectives[rarityScore]} ${color} ${shape} of the ${biomeNames[biomeType]}`,
        imageKey: `flower_${index}_img`,
        story: `A ${rarityAdjectives[rarityScore].toLowerCase()} ${shape.toLowerCase()} from the ${biomeNames[biomeType].toLowerCase()} regions. It shimmers with a faint ${color.toLowerCase()} hue. (F${index})`,
        biome: biomeType, rarity: rarityScore, basePrice: Math.max(5, basePriceVal),
        xpValue: xpValue, levelToBuy: levelToBuy
    };
}
export const ALL_FLORA_DATA = {};
for (let i=1;i<=24;i++){let r=1;if(i>12&&i<=20)r=2;if(i>20)r=3;ALL_FLORA_DATA[`flower_${i}`]=generateFlowerEntry(i,'main',r,Phaser.Math.Between(5,10)+(r*3));}
for (let i=25;i<=44;i++){let r=2;if(i>30&&i<=38)r=3;if(i>38&&i<=42)r=4;if(i>42)r=5;ALL_FLORA_DATA[`flower_${i}`]=generateFlowerEntry(i,'upper',r,Phaser.Math.Between(10,20)+(r*5));}
for (let i=45;i<=64;i++){let r=2;if(i>50&&i<=58)r=3;if(i>58&&i<=62)r=4;if(i>62)r=5;ALL_FLORA_DATA[`flower_${i}`]=generateFlowerEntry(i,'lower',r,Phaser.Math.Between(12,22)+(r*6));}
console.log("ALL_FLORA_DATA (XP, LvlToBuy) initialized:", Object.keys(ALL_FLORA_DATA).length, "flowers.");

export function getFloraForWorld(allFlora,targetBiome,count=10,unlockedBiomes=['main']){
    const availableK=Object.keys(allFlora).filter(k=>{const f=allFlora[k];return f.biome===targetBiome&&unlockedBiomes.includes(targetBiome);});
    if(availableK.length===0)return{};const weightedS=[];availableK.forEach(k=>{const f=allFlora[k];for(let i=0;i<(6-f.rarity);i++){weightedS.push(k);}});
    const shuffledW=weightedS.length>0?weightedS.sort(()=>0.5-Math.random()):availableK.sort(()=>0.5-Math.random());
    const selF={};let pC=0;for(const k of shuffledW){if(!selF[k]){selF[k]=allFlora[k];pC++;if(pC>=count)break;}}
    if(pC<count){const remK=availableK.filter(k=>!selF[k]);const shufRem=remK.sort(()=>0.5-Math.random());for(let i=0;i<shufRem.length&&pC<count;i++){if(!selF[shufRem[i]]){selF[shufRem[i]]=allFlora[shufRem[i]];pC++;}}}
    return selF;
}
