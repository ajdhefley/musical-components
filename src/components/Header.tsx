import React from 'react'

import './Header.scss'

function Header (): React.ReactElement {
    return (
        <header>
            <div
                className="logo"
                style={{ fontSize: '2rem' }}
            >
                Music App
            </div>
        </header>
    )
}

export default Header
