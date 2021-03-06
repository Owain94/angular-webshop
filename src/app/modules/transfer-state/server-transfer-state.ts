import { Injectable, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { PlatformState } from '@angular/platform-server';

import { TransferState } from './transfer-state';

import * as serialize from 'serialize-javascript';

export function isTag(tagName: string, node: any): boolean {
  return node.type === 'tag' && node.name === tagName;
}

@Injectable()
export class ServerTransferState extends TransferState {
    constructor( private state: PlatformState, private rendererFactory: RendererFactory2) {
        super();
    }

  /**
   * Inject the State into the bottom of the <head>
   */
  inject() {
    try {
      const document: any = this.state.getDocument();
      const transferStateString = serialize(this.toJson(), { isJSON: true });
      const renderer = this.rendererFactory.createRenderer(document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      const head = document.head;
      if (head.name !== 'head') {
        throw new Error('Please have <head> as the first element in your document');
      }

      const script = renderer.createElement('script');
      renderer.setValue(script, `window['TRANSFER_STATE'] = ${transferStateString}`);
      renderer.appendChild(head, script);
    } catch (e) {
      console.error(e);
    }
  }
}
