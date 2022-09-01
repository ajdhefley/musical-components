import React from 'react'

import './ErrorPage.scss'
import App from './App'
import { Link } from 'react-router-dom'

function ErrorPage (): React.ReactElement {
    return (
        <div className="content-wrapper">
            <p className="introText">An unknown error occured.</p>
            <Link to={App.Routes.ExerciseSelections}>Go To Exercise Selection</Link>
        </div>
    )
}

export default ErrorPage
