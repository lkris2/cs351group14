
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <div className="brand">Hyker</div>
          <ul className="nav-menu">
            <li className="nav-item"><a href="#ride">Ride</a></li>
            <li className="nav-item"><a href="#login">Login</a></li>
            <li className="nav-item"><a href="#about">About</a></li>
          </ul>
        </div>
      </nav>

      <header className="App-header">
        <div className="hero">
          <section className="two-col">
            <div className="left-col">
              <div className="illustration-container">
                <svg className="circle-outer" viewBox="0 0 420 420">
                  <circle cx="210" cy="210" r="200" fill="#571235"/>
                </svg>
                <svg className="circle-inner" viewBox="0 0 420 420">
                  <circle cx="260" cy="210" r="180" fill="white"/>
                </svg>
                <div className="hiker-container">
                  <img src="/src/assets/Group 1.svg" alt="Hiker illustration" className="hiker-image" />
                </div>
              </div>
            </div>
            <div className="right-col">
              <div className="text-wrapper">
                <h1 className="hero-title">Hyker</h1>
                <p className="hero-sub">Get your thumbs up and ride around today!</p>
              </div>
            </div>
          </section>
        </div>
      </header>
    </div>
  );
}

export default App;