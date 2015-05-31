var Cell = React.createClass({
  handleClick: function() {
    if (!this.props.mark) {
      this.props.handleClick(this.props.index);
    } else {
      return false;
    }
  },

  render: function() {
    var owner;
    if (this.props.mark === playerMark) { owner = 'player' }
    else if (this.props.mark === aiMark) { owner = 'AI' }

    return (
      <div className="cell" onClick={this.handleClick} data-marked-by={owner}>
        <span className="mark">
          {this.props.mark}
        </span>
      </div>
    )
  }
});
