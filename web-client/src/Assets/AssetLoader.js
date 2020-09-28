import spritesheetConfig from '../../../assets/Spritesheets/config';

class AssetLoader {
    /**
     * @param {Object} assetConfig
     * @param {Object} lazyAssetConfig
     * @param {Object} audioConfig
     */
    constructor(assetConfig, lazyAssetConfig, audioConfig) {
        this.assetConfig = assetConfig;
        this.lazyAssetConfig = lazyAssetConfig;
        this.audioConfig = audioConfig;
        this.loadingStatus = {};
    }

    getSpritesheetKey(keyParts) {
        return keyParts.join('_');
    }

    loadLazySpritesheets(loader, keyPartsArray, onCompleted) {
        loader.once('complete', () => {
            keyPartsArray.forEach(keyParts => {
                let key = this.getSpritesheetKey(keyParts);
                let statusKey = 'spritesheet' + '_' + key;
                this.loadingStatus[statusKey] = LOADING_STATUS_DONE;
            });

            setTimeout(() => {
                onCompleted();
            }, 0)
        });

        keyPartsArray.forEach(keyParts => {
            let key = this.getSpritesheetKey(keyParts);
            let statusKey = 'spritesheet' + '_' + key;
            let file = this.getSpritesheetConfig(spritesheetConfig, keyParts);
            if (file === null) {
                return false;
            }
            file = "Spritesheets/" + file;

            if (Object.prototype.hasOwnProperty.call(this.loadingStatus, statusKey) && this.loadingStatus[statusKey] === LOADING_STATUS_DONE) {
                return true;
            }

            if (Object.prototype.hasOwnProperty.call(this.loadingStatus, statusKey) && this.loadingStatus[statusKey] === LOADING_STATUS_LOADING) {
                return true;
            }

            this.loadingStatus[statusKey] = LOADING_STATUS_LOADING;
            this.loadAsset(loader, 'spritesheet', key, [file, {
                "frameWidth": 64,
                "frameHeight": 64
            }]);
        });

        if (!loader.isLoading()) {
            loader.start();
        }
    }

    loadLazySpritesheet(loader, keyParts, onCompleted, frameConfig = {
        "frameWidth": 64,
        "frameHeight": 64
    }) {
        let file = this.getSpritesheetConfig(spritesheetConfig, keyParts);
        if (file === null) {
            return false;
        }
        file = "Spritesheets/" + file;
        let key = this.getSpritesheetKey(keyParts);
        let statusKey = 'spritesheet' + '_' + key;

        if (Object.prototype.hasOwnProperty.call(this.loadingStatus, statusKey) && this.loadingStatus[statusKey] === LOADING_STATUS_DONE) {
            onCompleted();
            return true;
        }

        if (Object.prototype.hasOwnProperty.call(this.loadingStatus, statusKey) && this.loadingStatus[statusKey] === LOADING_STATUS_LOADING) {
            loader.once('complete', () => {
                onCompleted();
            });
            return true;
        }

        this.loadingStatus[statusKey] = LOADING_STATUS_LOADING;
        loader.once('complete', () => {
            this.loadingStatus[statusKey] = LOADING_STATUS_DONE;
            onCompleted();
        });

        this.loadAsset(loader, 'spritesheet', key, [file, frameConfig]);


        if (!loader.isLoading()) {
            loader.start();
        }
    }

    loadLazyAssets(loader, keys, onCompleted) {
        loader.once('complete', () => {
            keys.forEach(data => {
                let type = data[0];
                let key = data[1];
                let statusKey = type + '_' + key;
                this.loadingStatus[statusKey] = LOADING_STATUS_DONE;
            });

            setTimeout(() => {
                onCompleted();
            }, 0)
        });

        keys.forEach(data => {
            let type = data[0];
            let key = data[1];
            if (!Object.prototype.hasOwnProperty.call(this.lazyAssetConfig, type) || !Object.prototype.hasOwnProperty.call(this.lazyAssetConfig[type], key)) {
                return false;
            }

            let statusKey = type + '_' + key;
            if (Object.prototype.hasOwnProperty.call(this.loadingStatus, statusKey) && this.loadingStatus[statusKey] === LOADING_STATUS_DONE) {
                return true;
            }

            if (Object.prototype.hasOwnProperty.call(this.loadingStatus, statusKey) && this.loadingStatus[statusKey] === LOADING_STATUS_LOADING) {
                return true;
            }

            this.loadingStatus[statusKey] = LOADING_STATUS_LOADING;
            this.loadAsset(loader, type, key, this.lazyAssetConfig[type][key]);
        });

        if (!loader.isLoading()) {
            loader.start();
        }
    }

    /**
     * @param {Phaser.Loader.LoaderPlugin} loader
     * @param {string} type
     * @param {string} key
     * @param {function} onCompleted
     *
     * @return {boolean}
     */
    loadLazyAsset(loader, type, key, onCompleted) {
        if (!Object.prototype.hasOwnProperty.call(this.lazyAssetConfig, type) || !Object.prototype.hasOwnProperty.call(this.lazyAssetConfig[type], key)) {
            return false;
        }

        let statusKey = type + '_' + key;
        if (Object.prototype.hasOwnProperty.call(this.loadingStatus, statusKey) && this.loadingStatus[statusKey] === LOADING_STATUS_DONE) {
            onCompleted();
            return true;
        }

        if (Object.prototype.hasOwnProperty.call(this.loadingStatus, statusKey) && this.loadingStatus[statusKey] === LOADING_STATUS_LOADING) {
            loader.once('complete', () => {
                onCompleted();
            });
            return true;
        }


        this.loadingStatus[statusKey] = LOADING_STATUS_LOADING;
        loader.once('complete', () => {
            this.loadingStatus[statusKey] = LOADING_STATUS_DONE;
            onCompleted();
        });

        this.loadAsset(loader, type, key, this.lazyAssetConfig[type][key]);

        if (!loader.isLoading()) {
            loader.start();
        }

        return true;
    }

    /**
     * @param {Phaser.Loader.LoaderPlugin} loader
     * @param {function}  onProgressed
     * @param {function} onCompleted
     */
    loadStaticAssets(loader, onProgressed, onCompleted) {
        loader.on('progress', onProgressed);
        loader.once('complete', () => {
            loader.off('progress', onProgressed);
            onCompleted();
        });

        Object.keys(this.assetConfig).forEach((group) => {
            Object.keys(this.assetConfig[group]).forEach((key) => {
                this.loadAsset(loader, group, key, this.assetConfig[group][key])
            });
        });
    }

    /**
     * @param {Phaser.Loader.LoaderPlugin} loader
     * @param {string} type
     * @param {string} key
     * @param {Array|string} assetData
     */
    loadAsset(loader, type, key, assetData) {
        if (type === 'atlas' ||       // atlas:ƒ        (key, textureURL,  atlasURL,  textureXhrSettings, atlasXhrSettings)
            type === 'unityAtlas' ||  // unityAtlas:ƒ   (key, textureURL,  atlasURL,  textureXhrSettings, atlasXhrSettings)
            type === 'bitmapFont' ||  // bitmapFont:ƒ   (key, textureURL,  xmlURL,    textureXhrSettings, xmlXhrSettings)
            type === 'multiatlas') {  // multiatlas:ƒ   (key, textureURLs, atlasURLs, textureXhrSettings, atlasXhrSettings)
            loader[type](key, '/assets/' + assetData[0], '/assets/' + assetData[1]);
        } else if (type === 'spritesheet') { // spritesheet:ƒ  (key, url,         config,    xhrSettings)
            loader[type](key, '/assets/' + assetData[0], assetData[1]);
        } else if (type === 'audio') {
            // do not add mp3 unless, you bought a license ;)
            // opus, webm and ogg are way better than mp3
            if (Object.prototype.hasOwnProperty.call(assetData, 'opus') && this.audioConfig.opus) {
                loader[type](key, '/assets/' + assetData['opus']);

            } else if (Object.prototype.hasOwnProperty.call(assetData, 'webm') && this.audioConfig.webm) {
                loader[type](key, '/assets/' + assetData['webm']);

            } else if (Object.prototype.hasOwnProperty.call(assetData, 'ogg') && this.audioConfig.ogg) {
                loader[type](key, '/assets/' + assetData['ogg']);

            } else if (Object.prototype.hasOwnProperty.call(assetData, 'wav') && this.audioConfig.wav) {
                loader[type](key, '/assets/' + assetData['wav']);
            }
        } else if (type === 'html') { // html:ƒ (key, url, width, height, xhrSettings)
            loader[type](key, '/assets/' + assetData[0], assetData[1], assetData[2]);
        } else {
            // animation:ƒ (key, url, xhrSettings)
            // binary:ƒ (key, url, xhrSettings)
            // glsl:ƒ (key, url, xhrSettings)
            // image:ƒ (key, url, xhrSettings)
            // image:ƒ (key, [url, normal-url], xhrSettings)
            // json:ƒ (key, url, xhrSettings)
            // plugin:ƒ (key, url, xhrSettings)
            // script:ƒ (key, url, xhrSettings)
            // svg:ƒ (key, url, xhrSettings)
            // text:ƒ (key, url, xhrSettings)
            // tilemapCSV:ƒ (key, url, xhrSettings)
            // tilemapTiledJSON:ƒ (key, url, xhrSettings)
            // tilemapWeltmeister:ƒ (key, url, xhrSettings)
            // xml:ƒ (key, url, xhrSettings)
            loader[type](key, '/assets/' + assetData);
        }
    }


    getSpritesheetConfig(config, path) {
        for (let i = 0, n = path.length; i < n; ++i) {
            let key = path[i];
            if (key in config) {
                config = config[key];
            } else {
                return null;
            }
        }
        return config;
    }

}

export const LOADING_STATUS_LOADING = 1;
export const LOADING_STATUS_DONE = 2;
export default AssetLoader;
