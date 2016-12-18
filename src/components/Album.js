import React from 'react';
import tags from 'jsmediatags';

class Album extends React.Component {
    constructor(songs) {
        super();

        this.state = {
            list: [],
            albumArt: database.getCovers()[songs.data[0].album],
            query: ['']
        };

        this.state.list = songs.data.map((song) => {
            return  <a data-name={song.title} onClick={this.handleClick.bind(song)} className={'collection-item ' + window.colors.text + '-text'} key={songs.data.indexOf(song)}>
                        <span className='track'>{song.track}</span>
                        <span className='title'>{song.title}</span>
                    </a>;
        });

        this.queryListener = Emitter.on('Query', (query) => {
            this.state.query = query;
            this.setState(this.state);
        });

        Emitter.on('ColorUpdate', () => this.setState(this.state));
    }

    componentWillUnmount() {
        this.queryListener();
    }

    handleClick() {
        player.add(this);
    }

    render() {
        let list = this.state.list.filter((item) => {
            let match = this.state.query.filter((query) => item.props['data-name'].toLowerCase().match(new RegExp('.*' + query.toLowerCase().trim() + '.*', 'g'))).length > 0;
            return match;
        });

        return  <section className='album'>
                    <div className='album-art-header' style={{backgroundImage: 'url(' + this.state.albumArt + ')'}}></div>
                    <div className='collection'>
                        {list}
                    </div>
                </section>;
    }
}

export default Album;
