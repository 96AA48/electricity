import React from 'react';
import { homedir } from 'os';

class Settings extends React.Component {
    constructor() {
        super();

        this.state = {
            colors: [
                'red',
                'pink',
                'purple',
                'deep-purple',
                'indigo',
                'blue',
                'light-blue',
                'cyan',
                'teal',
                'green',
                'light-green',
                'lime',
                'yellow',
                'amber',
                'orange',
                'deep-orange',
                'brown',
                'grey',
                'blue-grey',
                'black',
                'white'
            ]
        };
    }

    onChanged(event) {
        window.colors[event.target.className.split(' ')[1]] = event.target.value;
        localStorage.setItem('colors', JSON.stringify(window.colors));
        Emitter.emit('ColorUpdate');
    }

    onMusicDirectoryChange(event) {
        let value = event.target.value;
        localStorage.setItem('musicDirectory', value);
    }

    resetDatabase() {
        localStorage.removeItem('database');
        document.location.reload();
    }

    resetColors() {
        localStorage.removeItem('colors');
        document.location.reload();
    }

    resetConnection() {
        localStorage.setItem('connection', JSON.stringify({
            host: undefined,
            port: undefined
        }));
        document.location.reload();
    }

    componentDidMount() {
        let self = this;

        $(document).ready(function() {
            $('select.navbar').material_select();
            $('select.navbar').change(self.onChanged);

            $('select.buttons').material_select();
            $('select.buttons').change(self.onChanged);

            $('select.player').material_select();
            $('select.player').change(self.onChanged);

            $('select.text').material_select();
            $('select.text').change(self.onChanged);

            $('select.progressbar').material_select();
            $('select.progressbar').change(self.onChanged);
        });
    }

    render() {
        let settings = JSON.parse(localStorage.getItem('colors')) || window.colors;
        let musicDirectory = localStorage.getItem('musicDirectory') || (homedir() + '/Music');

        let colorlist = this.state.colors.map((color) => {
            return  <option value={color} data-icon={'#' + color} className='left circle' key={this.state.colors.indexOf(color)}>
                        {color.substr(0, 1).toUpperCase() + color.substr(1, color.length)}
                    </option>
        });

        return  <section className='settings'>
                    <div className='input-field'>
                        <select className='icons navbar' defaultValue={settings.navbar}>
                            <option defaultValue='' disabled>Choose your option</option>
                            {colorlist}
                        </select>
                        <label>Navbar colors</label>
                    </div>

                    <div className='input-field'>
                        <select className='icons buttons' defaultValue={settings.buttons}>
                            <option defaultValue='' disabled>Choose your option</option>
                            {colorlist}
                        </select>
                        <label>Buttons colors</label>
                    </div>

                    <div className='input-field'>
                        <select className='icons player' defaultValue={settings.player}>
                            <option defaultValue='' disabled>Choose your option</option>
                            {colorlist}
                        </select>
                        <label>Player colors</label>
                    </div>

                    <div className='input-field'>
                        <select className='icons text' defaultValue={settings.text}>
                            <option defaultValue='' disabled>Choose your option</option>
                            {colorlist}
                        </select>
                        <label>Text colors</label>
                    </div>

                    <div className='input-field'>
                        <select className='icons progressbar' defaultValue={settings.progressbar}>
                            <option defaultValue='' disabled>Choose your option</option>
                            {colorlist}
                        </select>
                        <label>Progress bar colors</label>
                    </div>

                    <div className='input-field'>
                        <legend>Music Directory</legend>
                        <input onChange={this.onMusicDirectoryChange} defaultValue={musicDirectory} id='musicDirectory' type='text' className='validate' />
                    </div>

                    <a className={'waves-effect waves-light btn ' + window.colors.button} onClick={this.resetDatabase}>Reset / Update Database</a>
                    <br/>
                    <br/>
                    <a className={'waves-effect waves-light btn ' + window.colors.button} onClick={this.resetColors}>Reset Colors</a>
                    <br/>
                    <br/>
                    <a className={'waves-effect waves-light btn ' + window.colors.button} onClick={this.resetConnection}>Reset Connection</a>

                </section>;
    }
}

export default Settings;
