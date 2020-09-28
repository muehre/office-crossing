import {Scene} from 'phaser';
import {MainScene} from '../Game'

class LoginScene extends Scene
{
    constructor () {
        super({key: LoginScene.key});
    }

    init() {

    }

    create() {
        this.background = this.createBackground();
        this.text = this.add.text(
            this.game.scale.width / 2 - 120,
            this.game.scale.height / 2 - 20,
            'Office Crossing',
            { fontFamily: 'Arial', fontSize: 32, color: '#333333' }
        );


        this.tweens.add({
            targets: this.background,
            y: 350,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        })

        setTimeout(() => {
            this.scene.start(MainScene.key);
        }, 1500)
    }

    resize() {
        this.background.setPosition(this.game.scale.width / 2, this.game.scale.height / 2);
        this.text.setPosition(this.game.scale.width / 2 - 120, this.game.scale.height / 2 - 20);
    }

    update() {

    }

    createBackground() {
        let background = this.add.image(this.game.scale.width / 2, this.game.scale.height / 2,"brand_logo");
        background.setOrigin(0.5, 1);
        background.setScale(0.5, 0.5);

        return background;
    }
}

LoginScene.key = "login";

export default LoginScene;
