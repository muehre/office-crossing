import Game from './Game';
import './global.css';

// For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
const config = {
    "server": "http://127.0.0.1:8080",
    "url": "https://office-crossing.io",
    "title": "Office Crossing",
    "version": "0.1.0",
    "autoFocus": true,
    "world": {
    },
    "backgroundColor": '#ffffff',
    "assets": {
        "image": {
            // Tilesets
            "office": "Tileset/office.png",
            "interiors": "Tileset/interiors.png",
            "outside": "Tileset/outside.png",
            "outside2": "Tileset/outside2.png",
            // Brand
            "brand_logo": "Brand/logo.png",
            // Sprite
            "sprite_player": "Sprite/player.png"
        },
        "svg": {
        },
        "audio": {
        },
        "atlas": {
        },
        "multiatlas": {
        },
        "spritesheet": {
            "Player": ['Sprite/player.png', {
                "frameWidth": 32,
                "frameHeight": 32,
            }]
        },
        "xml": {
        },
        "tilemapTiledJSON": {
            "1stOG": "Tilemap/1stOG.json"
        }
    },
    "lazyAssets": {
    }
}
window.onload = function() {
    new Game(config);
};

if (module.hot)        // eslint-disable-line no-undef
    module.hot.accept(); // eslint-disable-line no-undef
