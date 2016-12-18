import React from 'react';

class AlbumList extends React.Component {
    constructor() {
        super();

        this.state = {
            list: [],
            query: ['']
        }

        this.queryListener = Emitter.on('Query', (query) => {
            this.state.query = query;
            this.setState(this.state);
        });

        Emitter.on('ColorUpdate', () => this.setState(this.state));
    }

    handleClick() {
        Emitter.emit('ChangeView', {view: 'Album', data: this});
    }

    componentDidMount() {
        let state = this.state;
        let albums = database.toAlbums();

        state.list = Object.keys(albums).map((album) => {
            return <li data-name={album} className={window.colors.text + '-text'} key={Object.keys(albums).indexOf(album)}>
                        <div className='collapsible-header'>
                            {album}
                        </div>
                        <div className='collapsible-body'>
                            <img onClick={this.handleClick.bind(albums[album])} src={database.covers[album]}/>
                            <div className={'collapsible-options grey-darken-2-text'}>
                                <i onClick={player.addAlbum.bind(player, album)} className={'material-icons ' + window.colors.buttons + '-text'}>play_arrow</i>
                                <i onClick={this.handleClick.bind(albums[album])} className='material-icons'>pageview</i>

                                <i className='material-icons'>playlist_add</i>
                                <i className='material-icons'>edit</i>
                            </div>
                        </div>
                    </li>;
        });

        $('.collapsible').collapsible({
            accordion: false
        });

        this.setState(state);
    }

    componentWillUnmount() {
        this.queryListener();
    }

    render() {
        let list = this.state.list.filter((item) => {
            let match = this.state.query.filter((query) => item.props['data-name'].toLowerCase().match(new RegExp('.*' + query.toLowerCase().trim() + '.*', 'g'))).length > 0;
            return match;
        });

        return  <section className='list'>
                    <ul className='collapsible' data-collapsible='accordion'>
                        {list}
                    </ul>
                </section>
    }
}

export default AlbumList;
