/// <reference types="node" />
import { BaseClass } from './base';
import { URL } from 'url';
import { Client } from '../core/client';
export declare class Image extends BaseClass {
    readonly small: URL | null;
    readonly medium: URL | null;
    readonly large: URL | null;
    constructor(client: Client, data: any);
}
export declare class YoutubeVideo extends BaseClass {
    readonly ID: string;
    readonly URL: URL;
    readonly embedURL: URL;
    constructor(client: Client, data: any);
}