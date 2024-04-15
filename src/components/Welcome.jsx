import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const PokemonCard = ({ name, image, type }) => {
    return (
      <div className="pokemon-card">
        <img src={image} alt={name} />
        <div className="pokemon-details">
          <h3>{name}</h3>
          <p>Type: {type}</p>
        </div>
      </div>
    );
  };

  const Welcome = () => {
    return (
      <div className="Welcome">
        <div className="HeaderStyle">
          <div className="Header-Img">
            <Link to="/profile" className="Header-Img">
              <img src="https://avatars.mds.yandex.net/i?id=dd8fe0b2db4aeb94c73c17ff7a3ea0ddc7405232-12423213-images-thumbs&n=13" alt="Hentai" />
            </Link>
          </div>
          <div className="Header-Logo">
            <Link to="/profile" className="Header-Logo">
              <img src="https://vignette.wikia.nocookie.net/nana/images/6/64/Nana-logo.png/revision/latest?cb=20180106011326" alt="Logo" />
            </Link>
          </div>
        </div>
        <div className="Welcome-content">
          <div className='survey-container'>
            <div className='survey-info'>
              <p>Statistika</p>
            </div>
          </div>
          <div className='Test-style'>
            <div className='Actyal'>
              <h3>Актуальные Тесты</h3>
            </div>
          </div>
        </div>
        <div class="pokemon-container">
  <button class="scroll-button prev">‹</button>
  <div class="pokemon-cards">
    <PokemonCard name="Pikachu" image="https://avatars.mds.yandex.net/i?id=0d899269efa120dc1fb8ae37a37b3d697cafd137-12994680-images-thumbs&n=13" type="Electric" />
    <PokemonCard name="Charmander" image="https://example.com/charmander.jpg" type="Fire" />
    <PokemonCard name="Pikachu" image="https://avatars.mds.yandex.net/i?id=0d899269efa120dc1fb8ae37a37b3d697cafd137-12994680-images-thumbs&n=13" type="Electric" />
    <PokemonCard name="Charmander" image="https://example.com/charmander.jpg" type="Fire" />
    <PokemonCard name="Pikachu" image="https://avatars.mds.yandex.net/i?id=0d899269efa120dc1fb8ae37a37b3d697cafd137-12994680-images-thumbs&n=13" type="Electric" />
    <PokemonCard name="Charmander" image="https://example.com/charmander.jpg" type="Fire" />
    <PokemonCard name="Pikachu" image="https://avatars.mds.yandex.net/i?id=0d899269efa120dc1fb8ae37a37b3d697cafd137-12994680-images-thumbs&n=13" type="Electric" />
    <PokemonCard name="Charmander" image="https://example.com/charmander.jpg" type="Fire" />
    <PokemonCard name="Pikachu" image="https://avatars.mds.yandex.net/i?id=0d899269efa120dc1fb8ae37a37b3d697cafd137-12994680-images-thumbs&n=13" type="Electric" />
    <PokemonCard name="Charmander" image="https://example.com/charmander.jpg" type="Fire" />
    <PokemonCard name="Pikachu" image="https://avatars.mds.yandex.net/i?id=0d899269efa120dc1fb8ae37a37b3d697cafd137-12994680-images-thumbs&n=13" type="Electric" />
    <PokemonCard name="Charmander" image="https://example.com/charmander.jpg" type="Fire" />
    <PokemonCard name="Pikachu" image="https://avatars.mds.yandex.net/i?id=0d899269efa120dc1fb8ae37a37b3d697cafd137-12994680-images-thumbs&n=13" type="Electric" />
    <PokemonCard name="Charmander" image="https://example.com/charmander.jpg" type="Fire" />
    <PokemonCard name="Pikachu" image="https://avatars.mds.yandex.net/i?id=0d899269efa120dc1fb8ae37a37b3d697cafd137-12994680-images-thumbs&n=13" type="Electric" />
    <PokemonCard name="Charmander" image="https://example.com/charmander.jpg" type="Fire" />
    <PokemonCard name="Pikachu" image="https://avatars.mds.yandex.net/i?id=0d899269efa120dc1fb8ae37a37b3d697cafd137-12994680-images-thumbs&n=13" type="Electric" />
    <PokemonCard name="Charmander" image="https://example.com/charmander.jpg" type="Fire" />
  </div>
  <button class="scroll-button next">›</button>
</div>
        <div className='Catalog'>
            <div className='Catalog-Text'>
                <h3>Каталог</h3>
                </div>
            <div className='pokemon-cards'>
            <PokemonCard name="Pikachu" image="https://avatars.mds.yandex.net/i?id=0d899269efa120dc1fb8ae37a37b3d697cafd137-12994680-images-thumbs&n=13" type="Electric" />
            <PokemonCard name="Charmander" image="https://example.com/charmander.jpg" type="Fire" />
            <PokemonCard name="Pikachu" image="https://avatars.mds.yandex.net/i?id=0d899269efa120dc1fb8ae37a37b3d697cafd137-12994680-images-thumbs&n=13" type="Electric" />
            <PokemonCard name="Charmander" image="https://example.com/charmander.jpg" type="Fire" />
            </div>
        </div>

        <div className='FooterStyle'>
          <div className='Footer-Logo'>
            <p>EZZZZ</p>
          </div>
          <div className='Footer-Button'>
            {/* Здесь могут быть кнопки */}
          </div>
          <div className='Footer-Navigation'>
            <p>Контакты</p>
          </div>
        </div>
      </div>
    );
  };
  

export default Welcome;
