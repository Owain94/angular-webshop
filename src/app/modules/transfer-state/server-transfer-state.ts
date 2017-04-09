import { Injectable, Optional, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { PlatformState } from '@angular/platform-server';

import { TransferState } from './transfer-state';

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
      const transferStateString = JSON.stringify(this.toJson());
      const renderer = this.rendererFactory.createRenderer(document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      let rootNode: any = document;
      let headNode: any;

      document.childNodes.some(child => isTag('html', child) && !!(rootNode = child));

      if (!rootNode) {
        rootNode = document;
      }

      rootNode.childNodes.some(child => isTag('head', child) && !!(headNode = child));

      const script = renderer.createElement('script');
      renderer.setValue(script, `
try {
  window['TRANSFER_STATE'] = ${ transferStateString };
} catch (e) {
}
      `);
      renderer.appendChild(headNode, script);
      renderer.setAttribute(script, 'angular', 'universal');
    } catch (e) {
      console.error(e);
    }
  }
}
