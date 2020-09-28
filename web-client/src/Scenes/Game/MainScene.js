import {Scene} from 'phaser';
import {MainScene as GuiMainScene} from './GUI';

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const DIRECTION_TOP = 0;
const DIRECTION_RIGHT = 1;
const DIRECTION_BOTTOM = 2;
const DIRECTION_LEFT = 3;
const ACCELERATION_SPEED = 0.1;
const MAX_SPEED = 0.4;
const MOVEMENT_TICK_RATE = 20;

class MainScene extends Scene {
    constructor() {
        super({
            key: MainScene.key,
        });

        this.playerPosition = {
            x: 20,
            y: 20,
        }
        this.playerAcceleration = {
            x: 0,
            y: 0,
        }

        this.animationState = {
            direction: 'down',
            type: 'idle',
        }

        this.playerControls = {
            [DIRECTION_TOP]: false,
            [DIRECTION_BOTTOM]: false,
            [DIRECTION_LEFT]: false,
            [DIRECTION_RIGHT]: false,
        }
    }

    init({state, control, tickRate}) {
        this.initialState = state;
        this.focusEntity = control;
        this.tickRate = tickRate;
    }

    create() {
        this.map = this.add.tilemap("1stOG");
        this.officeTileset = this.map.addTilesetImage("office", "office");
        this.interiorsTileset = this.map.addTilesetImage("interiors", "interiors");
        this.outsideTileset = this.map.addTilesetImage("outside", "outside");
        this.outside2Tileset = this.map.addTilesetImage("outside2", "outside2");

        this.blockingLayer = this.map.createStaticLayer("Blocking", this.officeTileset);
        this.groundLayer = this.map.createStaticLayer("Ground", [this.officeTileset, this.interiorsTileset, this.outsideTileset, this.outside2Tileset   ]);
        this.interiorsLayer = this.map.createStaticLayer("Interiors", this.interiorsTileset);

        this.createPlayer()
        this.bindKeyevents()

        this.startUI();
        this.tickInterval = setInterval(() => {
            this.move()
        }, 1000 / MOVEMENT_TICK_RATE)

    }

    update() {
    }

    resize() {
    }

    createPlayer() {
        this.player = this.add.sprite(0, 0, 'Player')
        this.player.setScale(2, 2)
        this.anims.create({
            key: 'walk_bottom',
            frames: this.anims.generateFrameNumbers('Player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'idle_bottom',
            frames: this.anims.generateFrameNumbers('Player', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'walk_top',
            frames: this.anims.generateFrameNumbers('Player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'idle_top',
            frames: this.anims.generateFrameNumbers('Player', { start: 5, end: 5 }),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'walk_left',
            frames: this.anims.generateFrameNumbers('Player', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'idle_left',
            frames: this.anims.generateFrameNumbers('Player', { start: 9, end: 9 }),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('Player', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1,
        })

        this.anims.create({
            key: 'idle_right',
            frames: this.anims.generateFrameNumbers('Player', { start: 13, end: 13 }),
            frameRate: 10,
            repeat: -1,
        })

        this.player.play('idle_bottom')
        this.cameras.main.startFollow(this.player)
    }

    bindKeyevents() {
        this.input.keyboard.on('keydown_A',  (event) => {
            this.playerControls[DIRECTION_LEFT] = true
        });
        this.input.keyboard.on('keyup_A',  (event) => {
            this.playerControls[DIRECTION_LEFT] = false
        });

        this.input.keyboard.on('keydown_D',  (event) => {
            this.playerControls[DIRECTION_RIGHT] = true
        });
        this.input.keyboard.on('keyup_D',  (event) => {
            this.playerControls[DIRECTION_RIGHT] = false
        });

        this.input.keyboard.on('keydown_W',  (event) => {
            this.playerControls[DIRECTION_TOP] = true
        });
        this.input.keyboard.on('keyup_W',  (event) => {
            this.playerControls[DIRECTION_TOP] = false
        });

        this.input.keyboard.on('keydown_S',  (event) => {
            this.playerControls[DIRECTION_BOTTOM] = true
        });
        this.input.keyboard.on('keyup_S',  (event) => {
            this.playerControls[DIRECTION_BOTTOM] = false
        });
    }

    move() {
        if (this.playerControls[DIRECTION_TOP] === this.playerControls[DIRECTION_BOTTOM]) {
            this.playerAcceleration.y = 0;
        } else if (this.playerControls[DIRECTION_TOP]) {
            this.playerAcceleration.y = this.playerAcceleration.y - ACCELERATION_SPEED;
        } else if (this.playerControls[DIRECTION_BOTTOM]) {
            this.playerAcceleration.y = this.playerAcceleration.y + ACCELERATION_SPEED;
        }
        if (this.playerControls[DIRECTION_LEFT] === this.playerControls[DIRECTION_RIGHT]) {
            this.playerAcceleration.x = 0;
        } else if (this.playerControls[DIRECTION_LEFT]) {
            this.playerAcceleration.x = this.playerAcceleration.x - ACCELERATION_SPEED;
        } else if (this.playerControls[DIRECTION_RIGHT]) {
            this.playerAcceleration.x = this.playerAcceleration.x + ACCELERATION_SPEED;
        }

        if (this.playerAcceleration.x > MAX_SPEED) {
            this.playerAcceleration.x = MAX_SPEED
        } else if (this.playerAcceleration.x < MAX_SPEED * -1) {
            this.playerAcceleration.x = MAX_SPEED * -1
        }

        if (this.playerAcceleration.y > MAX_SPEED) {
            this.playerAcceleration.y = MAX_SPEED
        } else if (this.playerAcceleration.y < MAX_SPEED * -1) {
            this.playerAcceleration.y = MAX_SPEED * -1
        }

        if ( this.blockingLayer.getTileAt(Math.round(this.playerPosition.x), Math.round(this.playerPosition.y + this.playerAcceleration.y)) !== null) {
            this.playerAcceleration.y = 0;
        }
        if ( this.blockingLayer.getTileAt(Math.round(this.playerPosition.x + this.playerAcceleration.x), Math.round(this.playerPosition.y)) !== null) {
            this.playerAcceleration.x = 0;
        }
        this.playerPosition.x = this.playerPosition.x + this.playerAcceleration.x;
        this.playerPosition.y = this.playerPosition.y + this.playerAcceleration.y;

        if (this.playerAcceleration.y !== 0 || this.playerAcceleration.x !== 0) {
            this.animationState.type = 'walk'
        } else {
            this.animationState.type = 'idle'
        }

        if (this.playerAcceleration.y < 0) {
            this.animationState.direction = 'top';
        } else if (this.playerAcceleration.x > 0) {
            this.animationState.direction = 'right';
        }  else if (this.playerAcceleration.y > 0) {
            this.animationState.direction = 'bottom';
        } else if (this.playerAcceleration.x < 0) {
            this.animationState.direction = 'left';
        }

        if (this.player.anims.currentAnim.key !== `${this.animationState.type}_${this.animationState.direction}`) {
            this.player.play(`${this.animationState.type}_${this.animationState.direction}`)
        }

        this.tweens.add({
            targets: this.player,
            x: { value: this.playerPosition.x * 48 + 24, duration: 1000 / MOVEMENT_TICK_RATE},
            y:  { value: this.playerPosition.y * 48, duration: 1000 / MOVEMENT_TICK_RATE},
            yoyo: false,
        })
    }

    onShutdown() {
        this.scene.stop(GuiMainScene.key);
    }

    startUI () {
        this.scene.run(GuiMainScene.key, {
            world: this.world,
            focusEntity: this.focusEntity,
        });
        this.scene.bringToTop(GuiMainScene.key);
    }
}

MainScene.key = 'game_main';

export default MainScene;


