import { Injectable, Optional, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { TransferState } from './transfer-state';
import { PlatformState } from '@angular/platform-server';

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

      let rootNode: any;
      let headNode: any;

      // tslint:disable-next-line:no-inferrable-types
      for (let i: number = 0; i < document.childNodes.length; ++i) {
        const child = document.childNodes[i];

        if (isTag('html', child)) {
          rootNode = child;
          break;
        }
      }

      if (!rootNode) {
        rootNode = document;
      }

      // tslint:disable-next-line:no-inferrable-types
      for (let i: number = 0; i < rootNode.childNodes.length; ++i) {
       const child = rootNode.childNodes[i];

        if (isTag('head', child)) {
          headNode = child;
          break;
        }
      }

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
