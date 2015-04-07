/** @jsx React.DOM */

var StartScreen = React.createClass({displayName: "StartScreen",
  render: function() {
    return (
      React.createElement("section", {className: "view active", "data-view": "start"}, 

        React.createElement("button", {className: "button js-create-game"}, "Create Game"), 
        React.createElement("button", {className: "button js-join-game"}, "Join Game"), 

        React.createElement("form", {className: "player-form js-player-form"}, 
          React.createElement("h2", {className: "sub-title"}, "Code"), 
          React.createElement("input", {className: "player-form__input js-player-form__gamecode"}), 
          React.createElement("h2", {className: "sub-title"}, "Player name"), 
          React.createElement("input", {className: "player-form__input js-player-form__input"})
        )

      )
    );
  }
});

var WaitScreen = React.createClass({displayName: "WaitScreen",
  render: function() {
    return (
      React.createElement("section", {className: "view", "data-view": "wait"}, 

        React.createElement("h1", {className: "main-title"}, "Waiting for players..."), 
        React.createElement("h2", {className: "sub-title"}, "Code: ", React.createElement("span", {className: "js-game-code"}))

      )
    );
  }
});

var GameScreen = React.createClass({displayName: "GameScreen",
  render: function() {
    return (
      React.createElement("section", {className: "view", "data-view": "game"}, 

        React.createElement("div", {className: "game"}, 

          React.createElement("div", {className: "objectives"}), 

          React.createElement("div", {className: "game__answers"}, 
            React.createElement("i", {className: "game__answers__arrow game__answers__arrow--left fa fa-angle-left"}), 
            React.createElement("i", {className: "game__answers__arrow game__answers__arrow--up fa fa-angle-up"}), 
            React.createElement("i", {className: "game__answers__arrow game__answers__arrow--down fa fa-angle-down"}), 
            React.createElement("i", {className: "game__answers__arrow game__answers__arrow--right fa fa-angle-right"})
          )

        )


      )
    );
  }
});

var Game = React.createClass({displayName: "Game",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(StartScreen, null), 
        React.createElement(WaitScreen, null), 
        React.createElement(GameScreen, null)
      )
    );
  }
});

React.render(
  React.createElement(Game, null),
  document.getElementById('game')
);