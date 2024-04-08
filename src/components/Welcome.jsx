import React, { useState } from 'react';
import './Welcome.css';

function Panel1() {
    return (
        <div className='panel'>
            <button>Действие 3</button>
            <button>Действие 2</button>
            <button>Действие 1</button>
        </div>
    );
}

function Panel2() {
    return (
        <div className='panel'>
            <button>Действие 1</button>
            <button>Действие 2</button>
            <button>Действие 3</button>
        </div>
    );
}

function ButtonWithPanel({ children, panelComponent: Panel }) {
    const [panelVisible, setPanelVisible] = useState(false);

    const togglePanel = () => {
        setPanelVisible(!panelVisible);
    };

    return (
        <div className='style' style={{ position: 'relative' }}>
            <button onClick={togglePanel}>{children}</button>
            {panelVisible && <Panel />}
        </div>
    );
}

function Welcome() {
    return (
        <div className="Welcome">
            <div className='HeaderStyle'>
                <div className='Header-Logo'>
                    <img src="https://avatars.mds.yandex.net/i?id=dd8fe0b2db4aeb94c73c17ff7a3ea0ddc7405232-12423213-images-thumbs&n=13" alt="Hentai" />
                </div>
                <div className='Header-Button'>
                      <ButtonWithPanel panelComponent={Panel1}>Ez solo</ButtonWithPanel>
                      <ButtonWithPanel panelComponent={Panel2}>Ez solo2</ButtonWithPanel>
                </div>
                <div className='Header-Navigacion'>
                    <p>О нас</p>
                </div>
            </div>
        </div>
    );
}


export default Welcome;
