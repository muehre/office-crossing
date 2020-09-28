import {Scene, Math} from 'phaser';
import {LoginScene} from "./Lobby";

class PreloadScene extends Scene
{
    constructor () {
        super({key: PreloadScene.key});
    }

    preload () {
        this.spinner = this.createSpinner();
        this.text = this.add.text(
            this.game.scale.width / 2 - 100,
            this.game.scale.height / 2 - 60,
            'Lädt Assets...',
            { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' }
        );

        this.game.assetLoader.loadStaticAssets(
            this.load,
            (percentage) => {
                this.updateSpinner(this.spinner, percentage);
            },
            () => {
                this.scene.start(LoginScene.key);
                this.scene.stop();
            }
        );
    }

    resize() {
        this.background.setPosition(this.game.scale.width / 2, this.game.scale.height / 2);
    }


    createSpinner() {
        let spinner = this.add.graphics();
        spinner.lineStyle(4, 0x42cbf4, 1);
        spinner.beginPath();
        spinner.arc(this.game.scale.width / 2 - 50, this.game.scale.height / 2 - 50, 100, Math.DegToRad(0), Math.DegToRad(0));
        spinner.strokePath();
        return spinner;
    }

    updateSpinner(spinner, percentage) {
        spinner.clear();
        spinner.lineStyle(4, 0x42cbf4, 1);
        spinner.beginPath();
        spinner.arc(this.game.scale.width / 2 - 50, this.game.scale.height / 2 - 50, 100, Math.DegToRad(0), Math.DegToRad(360 * percentage));
        spinner.strokePath();
    }
}

PreloadScene.key = "preload";

export default PreloadScene;
