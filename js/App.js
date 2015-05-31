var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Hello!</h1>
        <Game playerMark={playerMark} aiMark={aiMark} />
      </div>
    )
  }
});

React.render( <App/>, document.getElementById('app') );
