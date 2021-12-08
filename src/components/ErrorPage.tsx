import React from 'react';
import { Link } from 'react-router-dom';

import './ErrorPage.scss';
import App from './App';

export class ErrorPage extends React.Component {
    render() {
        return (
            <div className="content-wrapper">
                <p className="introText">An unknown error occured.</p>
                <Link to={App.Routes.ExerciseSelections}>Go To Exercise Selection</Link>
            </div>
        );
    }
}

export default ErrorPage;
