import Database from './Database';
import Player from './Player';
import Emitter from './Emitter';

window.colors = JSON.parse(localStorage.getItem('colors')) || {
    navbar: 'blue',
    buttons: 'blue',
    player: 'white',
    text: 'black',
    progressbar: 'blue'
};

window.player = new Player();
window.Emitter = new Emitter();
