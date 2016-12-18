import React from 'react';

class List extends React.Component {
    constructor() {
        super();
        this.state = {
            list: [],
            query: ['']
        };

        this.queryListener = Emitter.on('Query', (query) => {
            this.state.query = query;
            this.setState(this.state);
        });

        Emitter.on('ColorUpdate', () => this.setState(this.state));
    }

    handleClick() {
        player.add(this);
    }

    componentDidMount() {
        let state = this.state;
        let list = database.toList();

        for (let entry of list) {
            let item =  <a data-name={entry.title} onClick={this.handleClick.bind(entry)} className={'collection-item ' + window.colors.text + '-text'} key={list.indexOf(entry)}>
                            {entry.title}
                        </a>;

            state.list.push(item);
        }
        this.setState(state);
    }

    componentWillUnmount() {
        this.queryListener();
    }

    render() {
        let list = this.state.list.filter((item) => {
            let match = this.state.query.filter((query) => item.props['data-name'] && item.props['data-name'].toLowerCase().match(new RegExp('.*' + query.toLowerCase().trim() + '.*', 'g'))).length > 0;
            return match;
        });
        return  <section className='list'>
                    <div className='collection'>
                        {list}
                    </div>
                </section>
    }
}

export default List;
