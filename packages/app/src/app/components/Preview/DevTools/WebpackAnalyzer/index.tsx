import { messages } from '@codesandbox/common/lib/utils/bundler';
import { actions, dispatch, listen } from 'codesandbox-api';
import immer from 'immer';
import { debounce } from 'lodash-es';
import React from 'react';
import SplitPane from 'react-split-pane';

import { DevToolProps } from '..';

import { Container } from './elements';

enum Statuses {
  running
};

type State = {
  bundler: { version: string | null },
  running: boolean,
  watching: boolean,
};

const INITIAL_STATE = {
  bundler: { version: null },
  running: false,
  watching: false,
};

class WebpackAnalyzer extends React.Component<DevToolProps, State> {
  state = INITIAL_STATE;

  listener: () => void;

  componentDidMount() {
    this.listener = listen(this.handleMessage);
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener();
    }
  }

  handleMessage = (data) => {
    if (data.type !== messages.TYPE_BUNDLER) {
      return;
    }

    debugger

    switch (data.event) {
      case messages.BUNDLER_INFO:
        this.setState(oldState =>
          immer(oldState, state => {
            state.bundler.version = data.data.version
          })
        );
        break;
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps: DevToolProps) {
    if (nextProps.sandboxId !== this.props.sandboxId) {
    }

    if (this.props.hidden && !nextProps.hidden) {
      debugger
      dispatch({
        type: messages.TYPE_BUNDLER,
        event: messages.GET_BUNDLER_INFO
      });
    }
  }

  openFile = (path: string) => {
    dispatch(actions.editor.openModule(path));
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    return (
      <Container>
        Webpack: {this.state.bundler.version}
      </Container>
    );
  }
}

export const webpack = {
  id: 'codesandbox.webpack',
  title: 'Webpack',
  Content: WebpackAnalyzer,
  actions: [],
};
