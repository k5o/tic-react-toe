var Cell = React.createClass({
  handleClick: function() {
    if (!this.props.mark) {
      this.props.handleClick(this.props.index);
    } else {
      return false;
    }
  },

  render: function() {
    return (
      <div className={"cell " + this.props.mark} onClick={this.handleClick} >
        <span className="mark">
          {this.props.mark}
        </span>
      </div>
    )
  }
});
