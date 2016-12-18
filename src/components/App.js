import React from 'react';
import List from './List';
import AlbumList from './AlbumList';
import CoverList from './CoverList';
import ArtistList from './ArtistList';
import Album from './Album';
import Player from './Player';
import Nav from './Nav';
import Settings from './Settings';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            view: <CoverList />,
            last: {}
        }

        Emitter.on('ChangeView', this.setView.bind(this));
        Emitter.on('Back', this.goBack.bind(this));
    }

    componentDidMount() {
        document.onkeydown = this.shortcuts.bind(this);
    }

    shortcuts(event) {
        if (!window.searching) {
            if (event.keyCode === 49) {
                Emitter.emit('ChangeView', {view: 'CoverList'});
            }
            else if (event.keyCode === 50) {
                Emitter.emit('ChangeView', {view: 'AlbumList'});
            }
            else if (event.keyCode === 51) {
                Emitter.emit('ChangeView', {view: 'List'});
            }
        }

        if (event.keyCode === 192) {
            $('.button-collapse').sideNav('show');
        }
        else if ((event.keyCode === 70 && event.ctrlKey) || event.keyCode === 191 && this.state.view.type.name !== 'Settings') {
            Emitter.emit('Search');
        }
        else if (event.keyCode === 27) {
            Emitter.emit('Query', '')
            Emitter.emit('Escape');
        }
    }

    goBack() {
        this.state.view = this.state.last;

        this.setState(this.state);
    }

    setView(req) {
        let state = this.state;
        state.last = state.view;

        switch (req.view) {
            case 'Album':
                state.view = <Album data={req.data} />;
                break;
            case 'List':
                state.view = <List />
                break;
            case 'CoverList':
                state.view = <CoverList />
                break;
            case 'ArtistList':
                state.view = <ArtistList />
                break;
            case 'Settings':
                state.view = <Settings />
                break;
            default:
                state.view = <AlbumList />;
                break;
        }

        this.setState(state);
    }

    render() {
        return  <div>
                    <Nav />
                    {this.state.view}
                    <Player />
                </div>;
    }
}

export default App;
