import React from 'react';
import ReactDOM from 'react-dom';
import tags from 'jsmediatags';

class Nav extends React.Component {
    constructor(songs) {
        super();

        this.state = {
            breadcrumbs : [],
            search: false,
            albumArt: ''
        };

        Emitter.on('Search', () => {
            if (this.state.search) {
                ReactDOM.findDOMNode(this.refs.search).focus();
            }

            this.state.search = true;
            window.searching = true;
            this.setState(this.state);
        });

        Emitter.on('Escape', () => this.closeSearch());
        Emitter.on('Playlist', () => this.setState(this.state));
        Emitter.on('ColorUpdate', () => this.setState(this.state));
    }

    closeSearch() {
        window.searching = false;
        this.state.search = false;

        this.setState(this.state);
    }

    search(event) {
        let value = event.target.value;

        Emitter.emit('Query', value);
    }

    go(req) {
        Emitter.emit('ChangeView', req);
    }

    componentDidMount() {
        player.status();
    }

    render() {
        let playlist = (player.playlist || []).map((song) => {
            let index = player.playlist.indexOf(song);
            return  <li className={'playlist-item ' + window.colors.text + '-text'} key={index}>
                        <a onClick={player.play.bind(player, index)} className={'waves-effect ' + (player.current.file === song.file ? (window.colors.navbar + ' accent-1') : '')}>
                            {song.title}
                        </a>
                        <i onClick={player.remove.bind(player, index)} className='material-icons'>close</i>
                    </li>;
        });

        let name = (!database.covers[player.current.album] ? 'empty ': ' ') + (player.current === '' ? 'notplaying' : '');
        let nav =   <nav>
                        <div className={'nav-wrapper ' + window.colors.navbar + ' ' + (this.state.search ? 'search' : '')}>
                            {this.state.search && <form>
                                <div className='input-field'>
                                    <input onChange={this.search.bind(this)} id='search' type='search' autoFocus ref='search' />
                                    <label><i className='material-icons'>search</i></label>
                                    <i className='material-icons' onClick={this.closeSearch.bind(this)}>close</i>
                                </div>
                            </form>}


                            <a href='#!' className='brand-logo center'>Electricity</a>

                            <ul className='left'>
                                <li><a onClick={this.go.bind(this, {view: 'Settings'})}><i className='material-icons'>settings</i></a></li>
                            </ul>

                            <ul className='right'>
                                <li><a onClick={this.go.bind(this, {view: 'CoverList'})}><i className='material-icons'>explore</i></a></li>
                                <li><a onClick={this.go.bind(this, {view: 'AlbumList'})}><i className='material-icons'>album</i></a></li>
                                <li><a onClick={this.go.bind(this, {view: 'List'})}><i className='material-icons'>view_list</i></a></li>
                            </ul>

                            <ul id='slide-out' className='side-nav'>
                                <li>
                                    <div className={'userView ' + name}>

                                        <img className='background' src={database.covers[player.current.album]} />
                                        <a><span className='white-text name'>{player.current.album}</span></a>
                                        <a><span className='white-text email'>{player.current.title}</span></a>
                                    </div>
                                </li>

                                <li className={'playlist-controls'}>
                                    <i onClick={player.toggleRandom.bind(player)} className={'material-icons ' + (player.state.random ? window.colors.buttons + '-text': '')}>shuffle</i>
                                    <i onClick={player.toggleRepeat.bind(player)} className={'material-icons ' + (player.state.repeat ? window.colors.buttons + '-text': '')}>repeat</i>
                                    <i onClick={player.stop.bind(player)} className='material-icons'>stop</i>
                                    <i onClick={player.toggleConsume.bind(player)} className='material-icons'>{player.state.consume ? 'clear' : 'add'}</i>
                                    <i onClick={player.clear.bind(player)} className='material-icons'>clear_all</i>
                                </li>

                                {playlist}

                                {playlist.length === 0 && <li className={'playlist-item ' + window.colors.text + '-text'}>
                                                <a>
                                                    You currently have no items in queue.
                                                </a>
                                            </li>}
                            </ul>
                        </div>
                    </nav>;

        return  <div className='navbar-fixed'>
                    {nav}
                </div>;
    }
}

export default Nav;
