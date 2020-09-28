import PreloadScene from './PreloadScene';
import {
    Scenes as LobbyScenes,
    LoginScene,
} from './Lobby';

import {
    Scenes as GameScenes,
    MainScene,
} from './Game';

const BaseScenes = [
    PreloadScene,
];

const Scenes = BaseScenes.concat(LobbyScenes, GameScenes);

export {
    Scenes,
    PreloadScene,
    LoginScene,
    MainScene,
};
