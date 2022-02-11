import { Image } from '../resource/misc';
import { Person, PersonAnimeReference, PersonVoiceActorReference, PersonMangaReference } from '../resource/person';
import { BaseManager } from '../manager/base';
export interface PersonSearchFilter {
    orderBy: 'mal_id' | 'name' | 'birthday' | 'favorites';
    sort: 'desc' | 'asc';
}
export declare class PersonManager extends BaseManager {
    /** @hidden */
    storeCache(data: any): any;
    search(searchString: string, filter?: Partial<PersonSearchFilter>, offset?: number, maxCount?: number): Promise<Person[]>;
    list(offset?: number, maxCount?: number): Promise<Array<Person>>;
    listTop(offset?: number, maxCount?: number): Promise<Person[]>;
    random(): Promise<Person>;
    get(personID: number): Promise<Person | undefined>;
    getAnime(personID: number): Promise<Array<PersonAnimeReference> | undefined>;
    getVoiceActors(personID: number): Promise<Array<PersonVoiceActorReference> | undefined>;
    getManga(personID: number): Promise<Array<PersonMangaReference> | undefined>;
    getPictures(personID: number): Promise<Array<Image> | undefined>;
}