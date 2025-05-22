export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // This scene is usually for loading minimal assets needed for the PreloadScene's loading bar/screen
        // For now, it's very simple.
        console.log('BootScene: preload');

        // Example: Load an image for a loading bar background (if you had one)
        // this.load.image('loading_bg', 'assets/ui/loading_bg.png');
    }

    create() {
        console.log('BootScene: create');
        // Immediately start the PreloadScene
        this.scene.start('PreloadScene');
    }
}
