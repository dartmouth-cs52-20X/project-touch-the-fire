/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { Component } from 'react';

class Entry extends Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/no-unused-state
    this.state = {
    };
  }

  render() {
    return (
      <div id="lb-entry">
        <div id="rank">{this.props.rank}</div>
        <div id="username">{this.props.username}</div>
        <div id="score">{this.props.score}</div>

      </div>
    );
  }
}

export default Entry;
