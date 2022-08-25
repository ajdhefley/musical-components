import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Staff from '../lib/components/Staff';
import { Duration } from '../lib/types';
import { store } from '../redux-store';

import './App.scss';
import ErrorPage from './ErrorPage';
import Exercise from './Exercise';
import ExerciseOptions from './ExerciseOptions';
import ExerciseResults from './ExerciseResults';
import ExerciseSelection from './ExerciseSelections';
import Header from './Header';

function App() {
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
    
App.Routes = {
    ExercisePage: '/exercise/main',
    ExerciseOptions: '/exercise/options',
    ExerciseResults: '/exercise/results',
    ExerciseSelections: '/exercise/selections'
};

export default App;
    