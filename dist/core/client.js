"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const path_1 = require("path");
const api_1 = require("./api");
const heartbeat_1 = require("./heartbeat");
const anime_1 = require("../manager/anime");
const manga_1 = require("../manager/manga");
const club_1 = require("../manager/club");
const person_1 = require("../manager/person");
const character_1 = require("../manager/character");
const genre_1 = require("../manager/genre");
const magazine_1 = require("../manager/magazine");
const producer_1 = require("../manager/producer");
const season_1 = require("../manager/season");
const top_1 = require("../manager/top");
const events_1 = require("events");
const schedule_1 = require("../manager/schedule");
const user_1 = require("../manager/user");
class Client {
    /**
     * Instantiate new Jikan client
     *
     * @param options - Client options
     * @example
     * ```ts
     *  const Jikan = require('jikan4.js')
     *  const client = new Client()
     *
     *  console.log(await client.anime.get(5))
     * ```
    */
    constructor(options) {
        this.options = Client.setOptions(options);
        this.APIClient = new api_1.APIClient(this);
        this.anime = new anime_1.AnimeManager(this);
        this.manga = new manga_1.MangaManager(this);
        this.clubs = new club_1.ClubManager(this);
        this.people = new person_1.PersonManager(this);
        this.characters = new character_1.CharacterManager(this);
        this.genres = new genre_1.GenreManager(this);
        this.magazines = new magazine_1.MagazineManager(this);
        this.producers = new producer_1.ProducerManager(this);
        this.users = new user_1.UserManager(this);
        this.seasons = new season_1.SeasonManager(this);
        this.top = new top_1.TopManager(this);
        this.schedules = new schedule_1.ScheduleManager(this);
        this.heartbeat = new heartbeat_1.HeartBeatMonitor(this);
        this.events = new events_1.EventEmitter();
        Client.setGlobalClient(this);
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static setGlobalClient(client) {
        const window = Object.assign(global, { jikanClient: client });
        return window;
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static setOptions(options) {
        const defaultOptions = {
            dataPath: (0, path_1.join)(__dirname, '..', '..', '.Jikan'),
            host: 'api.jikan.moe',
            baseUri: 'v4',
            secure: true,
            dataRateLimit: 1200,
            dataExpiry: 1000 * 60 * 60 * 24,
            dataPaginationMaxSize: 25,
            requestTimeout: 15000,
            requestQueueLimit: 100,
            disableCaching: false
        };
        return Object.assign(defaultOptions, options);
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static getClient() {
        const window = global;
        return window.jikanClient || (window.jikanClient = new Client());
    }
    /**
     * Listen to client events.
     *
     * @example
     * ```ts
     * client.on('debug', console.log)
     * ```
    */
    on(event, listener) {
        this.events.on(event, listener);
        return this;
    }
    /**
     * Listen to client events once.
     *
     * @example
     * ```ts
     * client.once('debug', console.log)
     * ```
    */
    once(event, listener) {
        this.events.once(event, listener);
        return this;
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    emit(event, ...args) {
        return this.events.emit(event, ...args);
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    debug(scope, message) {
        return this.emit('debug', scope, message);
    }
}
exports.Client = Client;
