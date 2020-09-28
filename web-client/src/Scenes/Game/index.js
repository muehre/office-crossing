import MainScene from './MainScene';
import {Scenes as GUIScenes} from './GUI';

const Scenes = [].concat(GUIScenes, [
    MainScene
]);

export {
    Scenes,
    MainScene,
};