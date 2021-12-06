import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { store } from '../redux-store';

import './App.scss';
import ErrorPage from './ErrorPage';
import Exercise from './Exercise';
import ExerciseOptions from './ExerciseOptions';
import ExerciseResults from './ExerciseResults';
import ExerciseSelection from './ExerciseSelections';
import Header from './Header';

export class App extends React.Component {
  public static readonly Routes = {
    ExercisePage: '/exercise/main',
    ExerciseOptions: '/exercise/options',
    ExerciseResults: '/exercise/results',
    ExerciseSelections: '/exercise/selections'
  };

  render() {
    return (
      <div>
        <Header />
        <Provider store={store}>
          <BrowserRouter>
            <Switch>
              <Route exact path={App.Routes.ExerciseSelections} component={ExerciseSelection} />
              <Route exact path={App.Routes.ExerciseOptions} component={ExerciseOptions} />
              <Route exact path={App.Routes.ExerciseResults} component={ExerciseResults} />
              <Route exact path={App.Routes.ExercisePage} component={Exercise} />
              <Route path="*" component={ErrorPage} />
            </Switch>
          </BrowserRouter>
        </Provider>
      </div>
    );
  }
}

export default App;
