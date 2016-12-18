import React from 'react';

class ArtistList extends React.Component {
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
    }

    handleClick() {
        Emitter.emit('ChangeView', {view: 'Artist', data: this});
    }

    componentDidMount() {
        let state = this.state;
        let artists = database.toArtists();

        for (let artist in artists) {
            let songs = artists[artist].map((song) => <a className='collection-item'>{song.title}</a>)

            let item =  <li data-name={artist} className={window.colors.text + '-text'}>
                            <div className='collapsible-header'>
                                {artist}
                            </div>
                            <div className='collapsible-body'>
                                <div className='collection'>
                                    {songs}
                                </div>
                            </div>
                        </li>

            state.list.push(item);
        }

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

export default ArtistList;
