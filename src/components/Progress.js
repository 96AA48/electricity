import React from 'react';

class Progress extends React.Component {
    constructor() {
        super();

        this.state = {
            progress: '0%'
        }

        Emitter.on('progress', (progress) => {
            this.state.progress = progress;
            this.setState(this.state);
        });
    }

    handleClick(event) {
        player.go(event.pageX / document.querySelector('.progress').clientWidth);
    }

    render() {
        return  <div className='progress' onClick={this.handleClick}>
                    <div className={'determinate ' + window.colors.progressbar} style={{width: this.state.progress}}></div>
                </div>;
    }
}

export default Progress;
