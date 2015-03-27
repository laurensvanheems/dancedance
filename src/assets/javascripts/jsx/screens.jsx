/** @jsx React.DOM */

var StartScreen = React.createClass({
  render: function() {
    return (
      <section className="view active" data-view="start">

        <h1 className="main-title">Dance Dance</h1>

        <button className="button js-create-game">Create Game</button>
        <button className="button js-join-game">Join Game</button>

        <form className="player-form js-player-form">
          <h2 className="sub-title">Code</h2>
          <input className="player-form__input js-player-form__gamecode" />
          <h2 className="sub-title">Player name</h2>
          <input className="player-form__input js-player-form__input" />
        </form>

      </section>
    );
  }
});

var WaitScreen = React.createClass({
  render: function() {
    return (
      <section className="view" data-view="wait">

        <h1 className="main-title">Waiting for players...</h1>
        <h2 className="sub-title">Code: <span className="js-game-code"></span></h2>

      </section>
    );
  }
});

var GameScreen = React.createClass({
  render: function() {
    return (
      <section className="view" data-view="game">

        <div className="game">

          <div className="objectives"></div>

          <div className="game__answers">
            <i className="game__answers__arrow game__answers__arrow--left fa fa-angle-left"></i>
            <i className="game__answers__arrow game__answers__arrow--up fa fa-angle-up"></i>
            <i className="game__answers__arrow game__answers__arrow--down fa fa-angle-down"></i>
            <i className="game__answers__arrow game__answers__arrow--right fa fa-angle-right"></i>
          </div>

        </div>


      </section>
    );
  }
});

var Game = React.createClass({
  render: function() {
    return (
      <div>
        <StartScreen />
        <WaitScreen />
        <GameScreen />
      </div>
    );
  }
});

React.render(
  <Game />,
  document.getElementById('game')
);