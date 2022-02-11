"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopManager = void 0;
const tslib_1 = require("tslib");
const top_1 = require("../resource/top");
const base_1 = require("./base");
class TopManager extends base_1.BaseManager {
    listAnime(offset, maxCount) {
        return this.client.anime.listTop(offset, maxCount);
    }
    listManga(offset, maxCount) {
        return this.client.manga.listTop(offset, maxCount);
    }
    listPeople(offset, maxCount) {
        return this.client.people.listTop(offset, maxCount);
    }
    listCharacters(offset, maxCount) {
        return this.client.characters.listTop(offset, maxCount);
    }
    listReviews(offset = 0, maxCount = this.client.options.dataPaginationMaxSize) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('top/reviews', offset, maxCount);
            return rawData.map((data) => {
                switch (data.type) {
                    case 'anime': return new top_1.TopAnimeReview(this.client, data);
                    case 'manga': return new top_1.TopMangaReview(this.client, data);
                    default:
                        throw new Error(`Unknown review type: ${data.type}`);
                }
            });
        });
    }
}
exports.TopManager = TopManager;