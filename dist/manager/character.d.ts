import { BaseManager } from '../manager/base';
import { Character, CharacterAnimeReference, CharacterMangaReference, CharacterVoiceActorReference } from '../resource/character';
import { Image } from '../resource/misc';
export interface CharacterSearchFilter {
    orderBy: 'mal_id' | 'name' | 'favorites';
    sort: 'desc' | 'asc';
}
export declare class CharacterManager extends BaseManager {
    /** @hidden */
    storeCache(data: any): any;
    search(searchString: string, filter?: Partial<CharacterSearchFilter>, offset?: number, maxCount?: number): Promise<Character[]>;
    list(offset?: number, maxCount?: number): Promise<Array<Character>>;
    listTop(offset?: number, maxCount?: number): Promise<Character[]>;
    random(): Promise<Character>;
    get(characterID: number): Promise<Character | undefined>;
    getAnime(characterID: number): Promise<Array<CharacterAnimeReference> | undefined>;
    getManga(characterID: number): Promise<Array<CharacterMangaReference> | undefined>;
    getVoiceActors(characterID: number): Promise<Array<CharacterVoiceActorReference> | undefined>;
    getPictures(characterID: number): Promise<Array<Image> | undefined>;
}