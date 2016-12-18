import React from 'react';

class CoverList extends React.Component {
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
        console.log('HANDLING CLICK')
        Emitter.emit('ChangeView', {view: 'Album', data: this});
    }

    componentDidMount() {
        var state = this.state;
        let albums = database.toAlbums();

        for (let album in albums) {
            let albumName = album.substr(0, 30) + (album.length > 30 ? '...' : '');
            let item =  <div data-name={album} className={database.covers[album] ? 'card album-card' : 'card album-card empty'} key={Object.keys(albums).indexOf(album)}>
                            <div className='card-image'>
                                <img src={database.covers[album]} onClick={this.handleClick.bind(albums[album])} />
                            </div>
                            <div className='fixed-action-btn vertical'>
                                <a className={'btn-floating btn-large ' + window.colors.buttons} onClick={player.addAlbum.bind(player, album)}>
                                    <i className='large material-icons'>play_arrow</i>
                                </a>
                                <ul>
                                    <li><a className='btn-floating red'><i className='material-icons'>insert_chart</i></a></li>
                                    <li><a className='btn-floating yellow darken-1'><i className='material-icons'>format_quote</i></a></li>
                                    <li><a className='btn-floating green'><i className='material-icons'>publish</i></a></li>
                                    <li><a className='btn-floating blue'><i className='material-icons'>attach_file</i></a></li>
                                </ul>
                            </div>
                            <div className={'card-content ' + window.colors.text + '-text'}>
                                <p>{albumName}</p>
                            </div>
                        </div>;

            state.list.push(item);
        }

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

        return  <section className='album-list'>
                    {list}
                </section>
    }
}

export default CoverList;
