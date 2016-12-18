import tags from 'jsmediatags';
import fs from 'fs';
import { homedir } from 'os';

const debugAlbumArt = true;

class Database {
    constructor(list, covers) {
        this.database = list;
        this.covers = covers || {};

        if (!covers) {
            let progress = {};
            let errors   = 0;
            let done     = 0;
            let self     = this;

            let musicDirectory = localStorage.getItem('musicDirectory') || (homedir() + '/Music/');

            if (!fs.existsSync(musicDirectory)) {
                return;
            }

            for (let datum of this.database) {
                if (!progress[datum.album]) {
                    progress[datum.album] = true;

                    tags.read(musicDirectory + datum.file, {
                        onSuccess: tag => {
                            let base64String = "";

                            if (tag.tags.picture) {
                                for (let bit of tag.tags.picture.data) {
                                    base64String += String.fromCharCode(bit);
                                }

                                this.covers[datum.album] = "data:" + tag.tags.picture.format + ";base64," + window.btoa(base64String);
                                done++;
                            }

                            if (done + errors === Object.keys(progress).length) {
                                localStorage.setItem('covers', JSON.stringify(this.covers));
                            }

                        },
                        onError: function(error) {
                            if (debugAlbumArt)
                                console.error('Something went wrong with formatting covers', error, datum);

                            errors++;
                        }
                    });

                }
            }
        }

        localStorage.setItem('database', JSON.stringify(this.database));
    }

    toAlbums() {
        let albums = {};
        for (let entry of this.database) {
            if (!albums[entry.album || 'None'])
                albums[entry.album || 'None'] = [];

            albums[entry.album || 'None'].push(entry);
        }

        return albums;
    }

    toArtists() {
        let artists = {};
        for (let entry of this.database) {
            if (!artists[entry.artist || 'None'])
                artists[entry.artist || 'None'] = [];

            artists[entry.artist || 'None'].push(entry);
        }

        return artists;
    }

    toList() {
        return this.database;
    }

    getCovers() {
        return this.covers;
    }
}

Database.parse = (string) => {
    let songs = string.split('file: ').splice(1, string.split('file: ').length);
    let db = [];

    for (let song of songs) {
        var entry = {};

        entry.file          = song.split('\n')[0],
        entry.lastmodified  = song.match(/(?=Last-Modified\:).*/) ? song.match(/(?=Last-Modified\:).*/).join('').split(': ').splice(1, song.match(/(?=Last-Modified\:).*/).join('').split(': ').length).join(': ') : undefined,
        entry.time          = song.match(/(?=Time\:).*/) ? parseInt(song.match(/(?=Time\:).*/).join('').split(': ').splice(1, song.match(/(?=Time\:).*/).join('').split(': ').length).join(': ')) : undefined,
        entry.artist        = song.match(/(?=Artist\:).*/) ? song.match(/(?=Artist\:).*/).join('').split(': ').splice(1, song.match(/(?=Artist\:).*/).join('').split(': ').length).join(': ') : undefined,
        entry.title         = song.match(/(?=Title\:).*/) ? song.match(/(?=Title\:).*/).join('').split(': ').splice(1, song.match(/(?=Title\:).*/).join('').split(': ').length).join(': ') : undefined,
        entry.album         = song.match(/(?=Album\:).*/) ? song.match(/(?=Album\:).*/).join('').split(': ').splice(1, song.match(/(?=Album\:).*/).join('').split(': ').length).join(': ') : undefined,
        entry.albumartist   = song.match(/(?=AlbumArtist\:).*/) ? song.match(/(?=AlbumArtist\:).*/).join('').split(': ').splice(1, song.match(/(?=AlbumArtist\:).*/).join('').split(': ').length).join(': ') : undefined,
        entry.track         = song.match(/(?=Track\:).*/) ? song.match(/(?=Track\:).*/).join('').split(': ').splice(1, song.match(/(?=Track\:).*/).join('').split(': ').length).join(': ') : undefined,
        entry.genre         = song.match(/(?=Genre\:).*/) ? song.match(/(?=Genre\:).*/).join('').split(': ').splice(1, song.match(/(?=Genre\:).*/).join('').split(': ').length).join(': ') : undefined

        db.push(entry);
    }

    return db;
}

export default Database;
