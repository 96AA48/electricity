import React from 'react';
import Progress from './Progress';

class Player extends React.Component {
    constructor() {
        super();

        this.state = {};

        Emitter.on('status', () => this.setState(player.state));
        Emitter.on('Playlist', () => this.setState(player.state));
        Emitter.on('ColorUpdate', () => this.setState(this.state));

    }

    volume(event) {
        player.volume(event.target.value);
    }

    render() {
        $('p.range-field input').val(player.state.volume);

        return  <section className={'player ' + window.colors.player}>
                    <Progress />

                    <a href='#' data-activates='slide-out' className='button-collapse'>
                        {player.current && database.covers[player.current.album] && <img src={database.covers[player.current.album]} />}
                        {(!player.current || !database.covers[player.current.album]) && <div className='album-art-placeholder'><i className={'material-icons ' + window.colors.buttons + '-text'}>view_list</i></div>}
                    </a>

                    <div className='playing'>
                        <span>{player.current.title}</span>
                        <sup>{player.current.artist || player.current.albumArtist}</sup>
                    </div>

                    <button onClick={player.previous.bind(player)} className={'btn-floating btn-large waves-effect waves-light ' + window.colors.buttons}>
                        <i className='material-icons'>skip_previous</i>
                    </button>
                    <button onClick={player.toggle.bind(player)} className={'btn-floating btn-large waves-effect waves-light ' + window.colors.buttons}>
                        {player.playing ? <i className='material-icons'>pause</i> : <i className='material-icons'>play_arrow</i>}
                    </button>
                    <button onClick={player.next.bind(player)} className={'btn-floating btn-large waves-effect waves-light ' + window.colors.buttons}>
                        <i className='material-icons'>skip_next</i>
                    </button>

                    <form>
                        <p className='range-field input-field'>
                            <i className="material-icons prefix">volume_up</i>
                            <input type='range' className={window.colors.buttons} onChange={this.volume} min='0' max='100' />
                        </p>
                    </form>
                </section>;
    }
}

export default Player;
