import { dispatch, actions, listen } from 'codesandbox-api';
import { messages } from '@codesandbox/common/lib/utils/bundler';

import { parse } from 'sandbox-hooks/react-error-overlay/utils/parser';
import { map } from 'sandbox-hooks/react-error-overlay/utils/mapper';

import Manager from '../manager';
import { Module } from '../types/module';
import { Event } from './types';

export { messages };

export default class WebpackAnalyzer {
  manager: Manager;
  watching: boolean = true;

  constructor(manager: Manager) {
    this.manager = manager;
    listen(this.handleCodeSandboxMessage);
    this.sendMessage(messages.INITIALIZE);
  }

  sendMessage(event: string, message: any = {}) {
    dispatch({
      type: messages.TYPE_BUNDLER,
      event,
      ...message,
    });
  }

  async errorToCodeSandbox(
    error: Error & {
      matcherResult?: boolean;
    }
  ) {
    const parsedError = parse(error);
    const mappedErrors = await map(parsedError);

    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      matcherResult: Boolean(error.matcherResult),
      mappedErrors,
    };
  }

  handleMessage = async (message: Event) => {

  };

  handleCodeSandboxMessage = (message: any) => {
    if (message.type !== messages.TYPE_BUNDLER) {
      return;
    }

    debugger;

    switch (message.event) {
      case 'set-build-watching':
        this.watching = message.watching;
        if (message.watching === true) {
          // start bundle
        }
        break;
      case messages.GET_BUNDLER_INFO: {
        const webpackModule = this.manager.resolveModule('webpack', '/');
        this.manager.transpileModules(webpackModule);
        const webpack = this.manager.evaluateModule(webpackModule);
        debugger
        console.log(JSON.stringify(Object.keys(webpack)));
        this.sendMessage(messages.BUNDLER_INFO, { data: { version: webpack.version } });
        break;
      }
      case 'build':
        break;
    }
  };

  // We stub this, because old versions of CodeSandbox still needs this
  reportError = () => { };
}
