import mpd from 'mpd';
import Database from './Database';

class Player {
    constructor() {
        let connection = JSON.parse(localStorage.getItem('connection'));

        this.client = mpd.connect(connection || {host: 'localhost', port: 6600});

        this.client.on('error', () => error());

        this.state = {}

        this.client.on('ready', this.ready.bind(this));
        this.client.on('system-playlist', this.status.bind(this));
        this.client.on('system-player', this.status.bind(this));
        this.client.on('system-options', this.status.bind(this));

        setInterval(this.progress.bind(this), 50);

        this._ready = false;
        this.playing = false;
        this.current = {};
        this.playlist = [];
    }

    progress() {
        this.command('status', (string) => {
            let elapsed = string.match(/(?=elapsed\:).*/) && parseInt(string.match(/(?=elapsed\:).*/).join('').split(': ')[1]);
            let progress = (((elapsed || 0) / (this.current.time || 0)) * 100) + '%';

            Emitter.emit('progress', progress);
        });
    }

    status() {
        this.command('status', (string) => {
            this.state = {
                volume:         parseInt(string.match(/(?=volume\:).*/).join('').split(': ')[1]),
                repeat:         string.match(/(?=repeat\:).*/).join('').split(': ')[1] === "1" ? true : false,
                random:         string.match(/(?=random\:).*/).join('').split(': ')[1] === "1" ? true : false,
                single:         string.match(/(?=single\:).*/).join('').split(': ')[1] === "1" ? true : false,
                consume:        string.match(/(?=consume\:).*/).join('').split(': ')[1] === "1" ? true : false,
                playlist:       string.match(/(?=playlist\:).*/).join('').split(': ')[1],
                playlistlength: parseInt(string.match(/(?=playlistlength\:).*/).join('').split(': ')[1]),
                mixrampdb:      string.match(/(?=mixrampdb\:).*/).join('').split(': ')[1],
            };

            this.playing = string.match(/(?=state\:).*/).join('').split(': ')[1] === 'play' ? true : false;
        });

        this.command('currentsong', (string) => {
            this.current = string && Database.parse(string)[0];
        });

        this.getPlaylist();
    }

    getPlaylist() {
        this.command('playlistinfo', (string) => {
            this.playlist = string && Database.parse(string);
            Emitter.emit('Playlist');
        });
    }

    play(index) {
        this.command('play', [index], () => this.status());
    }

    go(percent) {
        this.command('seekcur', [this.current.time * percent], () => {});
    }

    addAlbum(album) {
        if (database.toAlbums()[album])
            database.toAlbums()[album].forEach((song) => this.add(song));
        else
            console.error('Tried to add album that doesn\'t exist!');
    }

    add(song) {
        let playlistEmpty = this.playlist.length === 0;
        this.command('add', [song.file], () => playlistEmpty && this.play(0));
    }

    remove(index) {
        this.command('delete', [index], () => {});
    }

    stop() {
        this.command('stop');
    }

    clear() {
        this.command('clear');
    }

    next() {
        this.command('next');
    }

    volume(value) {
        this.command('setvol', [value], () => {});
    }

    toggleRandom() {
        this.command('random', [(this.state.random ? 0 : 1)], () => {});
    }

    toggleRepeat() {
        this.command('repeat', [(this.state.repeat ? 0 : 1)], () => {});
    }

    toggleConsume() {
        this.command('consume', [(this.state.consume ? 0 : 1)], () => {});
    }

    toggle() {
        this.command('pause', [this.playing ? 0 : 1]);
    }

    previous() {
        this.command('previous');
    }

    database(callback) {
        this.command('listallinfo', ['/'], callback);
    }

    command(command, array, callback) {
        if (this._ready) {
            if (typeof array === 'function' || callback === undefined) {
                callback = array;
                array = [];
            }

            array = array || [];

            this.client.sendCommand(mpd.cmd(command, array), (err, msg) => {
                if (err)
                    throw err;
                else
                    typeof callback === 'function' ? callback(msg) : null;
            });
        }
    }

    ready() {
        this._ready = true;
        let storedDatabase = localStorage.getItem('database');

        if (!storedDatabase) {
            console.debug('Didn\'t find database in localStorage, parsing new one.');

            this.database((data) => {
                window.database = new Database(Database.parse(data));
                this.status();
                init();
            });
        }
        else {
            console.debug('Found database in localStorage, loading database.');

            let db = JSON.parse(localStorage.getItem('database'));
            let covers = JSON.parse(localStorage.getItem('covers'));

            window.database = new Database(db, covers);
            init();
        }
    }
}

export default Player;
