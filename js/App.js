var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Tic-React-Toe</h1>
        <Game playerMark={playerMark} aiMark={aiMark} />
        <p className="credit">
          &copy; <a href="https://www.kokev.in">Kevin Ko</a>
        </p>
      </div>
    )
  }
});

React.render( <App/>, document.getElementById('app') );
