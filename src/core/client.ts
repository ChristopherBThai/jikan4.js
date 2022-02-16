import { join } from 'path'
import { APIClient } from './api'
import { HeartBeatMonitor } from './heartbeat'
import { AnimeManager } from '../manager/anime'
import { MangaManager } from '../manager/manga'
import { ClubManager } from '../manager/club'
import { PersonManager } from '../manager/person'
import { CharacterManager } from '../manager/character'
import { GenreManager } from '../manager/genre'
import { MagazineManager } from '../manager/magazine'
import { ProducerManager } from '../manager/producer'
import { SeasonManager } from '../manager/season'
import { TopManager } from '../manager/top'
import { EventEmitter } from 'events'
import { ScheduleManager } from '../manager/schedule'
import { UserManager } from '../manager/user'

export interface ClientOptions {
  /**
   * The hostname of the server.
   *
   * This option could be useful if you are hosting your own instance
   * of Jikan REST API.
   *
   * Default value: `api.jikan.moe`
  */
  host: string

  /**
   * The base pathname of each request.
   *
   * Default value: `v4`
  */
  baseUri: string

  /**
   * Whether to use HTTPS protocol instead of HTTP.
   *
   * Default value: `false`
  */
  secure: boolean

  /**
   * The number of miliseconds to wait before creating another request.
   * This is to avoid getting rate-limited by
   *
   * Default value: `1200` (50 requests per minute)
  */
  dataRateLimit: number

  /**
   * The number of miliseconds before the cache is expired. This is an
   * effort to avoid sending multiple requests for the same content to
   *
   * Default value: `86400000` (1 day)
   */
  dataExpiry: number

  /**
   * The number of items to be returned on each paginated request.
   *
   * Default value: `25`
  */
  dataPaginationMaxSize: number

  /**
   * The number of miliseconds before giving up on a request.
   *
   * Default value: `15000` (15 seconds)
  */
  requestTimeout: number

  /**
   * The maximum limit of requests in the queue. This is an effort to
   * prevent clogging the queue.
   *
   * Default value: `100`
  */
  requestQueueLimit: number

  /**
   * Whether to disable cache or not. It's recommended that this option is disabled
   * to avoid sending multiple requests for the same content to
  */
  disableCaching: boolean

  /**
   * The number of retries on HTTP 500 errors.
  */
  maxApiErrorRetry: number

  dataPath: string
}

export interface ClientEvents {
  debug: [scope: string, message: string]
}

export type ClientEventNames = keyof ClientEvents

export class Client {
  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  private static setGlobalClient (client: Client) {
    const window: globalThis.NodeJS.Global & { jikanClient?: Client } = Object.assign(global, { jikanClient: client })

    return window
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  private static setOptions (options?: Partial<ClientOptions>): ClientOptions {
    const defaultOptions: ClientOptions = {
      dataPath: join(__dirname, '..', '..', '.Jikan'),
      host: 'api.jikan.moe',
      baseUri: 'v4',

      secure: true,

      dataRateLimit: 1200, // 50 API requests a minute
      dataExpiry: 1000 * 60 * 60 * 24, // 1 day expiration
      dataPaginationMaxSize: 25,

      requestTimeout: 15000,
      requestQueueLimit: 100,

      maxApiErrorRetry: 5,

      disableCaching: false
    }

    return Object.assign(defaultOptions, options)
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public static getClient () {
    const window: globalThis.NodeJS.Global & { jikanClient?: Client } = global

    return window.jikanClient || (window.jikanClient = new Client())
  }

  /**
   * Current options of the client.
   *
   * You can change client options anytime.
  */
  public readonly options: ClientOptions

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public readonly APIClient: APIClient

  /**
   * Anime resource context.
   *
   * @example
   * ```ts
   * const anime = await client.anime.get(5)
   * const episodes = await anime.getEpisodes()
   *
   * console.log(anime, episodes)
   * ```
  */
  public readonly anime: AnimeManager

  /**
   * Manga resource context.
   *
   * @example
   * ```ts
   * const manga = await client.manga.get(4)
   * const characters = await manga.getCharacters()
   *
   * console.log(manga, characters)
   * ```
  */
  public readonly manga: MangaManager

  /**
   * Clubs resource context.
   *
   * @example
   * ```ts
   * const club = await client.clubs.get(<id>)
   *
   * console.log(club.mmeberCount)
   * ```
  */
  public readonly clubs: ClubManager

  /**
   * People resource context.
   *
   * @example
   * ```ts
   * const person = await client.people.get(<id>)
   * const pictures = await person.getPictures()
   *
   * console.log(`${person.name}`, pictures)
   * ```
  */
  public readonly people: PersonManager

  /**
   * Characters resource context.
   *
   * @example
   * ```ts
   * const character = await client.characters.get(1)
   * const voiceActors = await character.getVoiceActors()
   *
   * console.log(character, voiceActors)
   * ```
  */
  public readonly characters: CharacterManager

  /**
   * Genres resource context.
   *
   * @example
   * ```ts
   * const genres = await client.genres.list()
   *
   * console.log(genres)
   * ```
  */
  public readonly genres: GenreManager

  /**
   * Magazines resource context.
   *
   * @example
   * ```ts
   * const magazines = await client.magazines.list()
   *
   * console.log(magazines)
   * ```
  */
  public readonly magazines: MagazineManager

  /**
   * Producers resource context.
   *
   * @example
   * ```ts
   * const producers = await client.producers.list()
   *
   * console.log(producers)
   * ```
  */
  public readonly producers: ProducerManager

  public readonly users: UserManager

  /**
   * Seasons resource context.
   *
   * @example
   * ```ts
   * const seasons = await client.seasons.list()
   *
   * console.log(seasons)
   * ```
  */
  public readonly seasons: SeasonManager

  public readonly top: TopManager

  public readonly schedules: ScheduleManager

  /**
   * Check if MAL is down.
   *
   * @example
   * ```ts
   * const heartbeat = await client.heartbeat.check()
   *
   * if (heartbeat.down)
   *   console.warn('MAL is down!')
   * ```
  */
  public readonly heartbeat: HeartBeatMonitor

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public readonly events: EventEmitter

  /**
   * Listen to client events.
   *
   * @example
   * ```ts
   * client.on('debug', console.log)
   * ```
  */

  public on <T extends ClientEventNames> (event: T, listener: (...args: ClientEvents[T]) => void): Client {
    this.events.on(event, <any> listener)

    return this
  }

  /**
   * Listen to client events once.
   *
   * @example
   * ```ts
   * client.once('debug', console.log)
   * ```
  */

  public once <T extends ClientEventNames> (event: T, listener: (...args: ClientEvents[T]) => void): Client {
    this.events.once(event, <any> listener)

    return this
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public emit <T extends ClientEventNames> (event: T, ...args: ClientEvents[T]): boolean {
    return this.events.emit(event, ...args)
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public debug (scope: string, message: string) {
    return this.emit('debug', scope, message)
  }

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
  public constructor (options?: Partial<ClientOptions>) {
    this.options = Client.setOptions(options)
    this.APIClient = new APIClient(this)

    this.anime = new AnimeManager(this)
    this.manga = new MangaManager(this)
    this.clubs = new ClubManager(this)
    this.people = new PersonManager(this)
    this.characters = new CharacterManager(this)
    this.genres = new GenreManager(this)
    this.magazines = new MagazineManager(this)
    this.producers = new ProducerManager(this)
    this.users = new UserManager(this)
    this.seasons = new SeasonManager(this)
    this.top = new TopManager(this)
    this.schedules = new ScheduleManager(this)

    this.heartbeat = new HeartBeatMonitor(this)

    this.events = new EventEmitter()

    Client.setGlobalClient(this)
  }
}
