import {Game as PhaserGame, AUTO, Scale} from 'phaser';
import AssetLoader from './Assets';
import {debounce} from './Helper';
import {Scenes} from './Scenes';


class Game extends PhaserGame {
    constructor(config = {}) {
        config = Game.bootstrapConfig(config);
        super(config);

        this.assetLoader = new AssetLoader(config.assets, config.lazyAssets, this.device.audio);

        window.addEventListener('resize', debounce(() => this.onResize(), 100));
    }

    onResize() {
        this.scale.setGameSize(window.innerWidth, window.innerHeight);
        this.scene.scenes.forEach((scene) => {

            //Resize Cameras
            if (scene.cameras.main) {
                scene.cameras.main.setSize(this.canvas.width, this.canvas.height);
            }

            // call resize method of each scene
            if (typeof scene.resize === "function" && this.scene.isActive(scene.scene.key)) {
                scene.resize();
            }
        });
    }

    static bootstrapConfig(rawConfig) {
        let config = {};
        config.scene = Scenes;

        Object.assign(config, {
            type: AUTO,
            pixelArt: false,
            roundPixels: false,
            parent: 'main',
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: window.devicePixelRatio,
            scale: {
                mode: Scale.RESIZE,
                autoCenter: Scale.CENTER_BOTH
            }
        });

        Object.assign(config, rawConfig);

        return config;
    }
}

export default Game;
