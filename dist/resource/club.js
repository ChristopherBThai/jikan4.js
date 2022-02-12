"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubMember = exports.ClubStaff = exports.Club = void 0;
const base_1 = require("./base");
class Club extends base_1.BaseResource {
    constructor(client, data) {
        var _a, _b;
        super(client, data);
        this.imageUrl = Club.parseURL((_b = (_a = data.images) === null || _a === void 0 ? void 0 : _a.jpg) === null || _b === void 0 ? void 0 : _b.image_url, true);
        this.memberCount = data.members_count;
        this.pictureCount = data.pictures_count;
        this.category = Club.parseCategory(data.category);
        this.created = Club.parseDate(data.created);
        this.type = Club.parseType(data.type);
        this.staff = data.staff.map((staff) => new ClubStaff(client, this.id, staff));
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static parseCategory(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'actors & artists': return 'ActorsAndArtists';
            case 'anime': return 'Anime';
            case 'characters': return 'Characters';
            case 'cities & neighborhoods': return 'CitiesAndNeighborhoods';
            case 'companies': return 'Companies';
            case 'conventions': return 'Conventions';
            case 'games': return 'Games';
            case 'japan': return 'Japan';
            case 'manga': return 'Manga';
            case 'music': return 'Music';
            case 'other':
            case 'others': return 'Others';
            case 'schools': return 'Schools';
            case 'none': return 'None';
            default: return 'Unknown';
        }
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static parseType(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'public': return 'Public';
            case 'private': return 'Private';
            case 'secret': return 'Secret';
            default: return 'Unknown';
        }
    }
    getMembers() {
        return this.client.clubs.getMembers(this.id);
    }
}
exports.Club = Club;
class ClubStaff extends base_1.BaseClass {
    constructor(client, clubId, data) {
        super(client);
        this.clubId = clubId;
        this.url = ClubStaff.parseURL(data.url);
        this.username = data.username;
    }
    getClub() {
        return this.client.clubs.get(this.clubId);
    }
}
exports.ClubStaff = ClubStaff;
class ClubMember extends base_1.BaseClass {
    constructor(client, clubId, data) {
        super(client);
        this.clubId = clubId;
        this.URL = ClubMember.parseURL(data.url);
        this.username = data.username;
        this.imageURL = ClubMember.parseURL(data.image_url, true);
    }
    getClub() {
        return this.client.clubs.get(this.clubId);
    }
}
exports.ClubMember = ClubMember;
