import React from 'react';

import './Header.scss';

export class Header extends React.Component {

    render() {
        return (
            <header>
                <div className="logo" style={{ fontSize: '2rem' }}>Music App</div>
            </header>
        );
    }
}

export default Header;
