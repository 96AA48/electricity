import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import ErrorApp from './components/ErrorApp';

window.init = () => {
  ReactDOM.render(
      <App />,
      document.getElementById('content')
  );

  $(".button-collapse").sideNav();
}

window.error = () => {
  ReactDOM.render(
      <ErrorApp />,
      document.getElementById('content')
  );
}
