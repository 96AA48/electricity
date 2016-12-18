import React from 'react';

class ErrorApp extends React.Component {
    constructor() {
        super();
    }

    connect(event) {
        event.preventDefault();

        let refs = this.refs;

        let connection = {
            host: refs.host.value,
            port: refs.port.value
        };

        localStorage.setItem('connection', JSON.stringify(connection));
        document.location.reload();
    }

    render() {

        return  <div className='error'>
                    <h3>Hey there, help us find your MPD!</h3>
                    <form>
                        <label>Host</label>
                        <input ref='host' type='text' defaultValue='localhost' />
                        <input ref='port' type='number' defaultValue='6600' />

                        <button onClick={this.connect.bind(this)}>Connect</button>
                    </form>
                </div>;
    }
}

export default ErrorApp;
