export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create() {
        console.log('CreditsScene: create');
        this.cameras.main.setBackgroundColor('#2c3e50'); // A calm, dark blue/grey

        this.add.text(this.cameras.main.width / 2, 100, 'FLORA COLLECTOR', {
            font: '40px Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, 200, 'Developer: wdalt', {
            font: '28px Arial', fill: '#e0e0e0'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, 250, 'Tester: my_mb12', {
            font: '28px Arial', fill: '#e0e0e0'
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, 320, 'Made with Phaser 3', {
            font: '24px Arial', fill: '#cccccc'
        }).setOrigin(0.5);


        // Back Button
        const backButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 100, 'Back to Main Menu', {
            font: '24px Arial',
            fill: '#ffffff',
            backgroundColor: '#7f8c8d', // A greyish color
            padding: { x: 15, y: 8 }
        })
        .setOrigin(0.5)
        .setInteractive();

        backButton.on('pointerover', () => backButton.setStyle({ fill: '#f1c40f' }));
        backButton.on('pointerout', () => backButton.setStyle({ fill: '#ffffff' }));
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene'); // Go back to MainMenu
        });
    }
}
