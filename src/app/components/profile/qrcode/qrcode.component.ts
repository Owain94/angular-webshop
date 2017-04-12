import { Component, Input, ElementRef, OnInit, Renderer } from '@angular/core';

import * as qrcode from 'qrcode-generator';

@Component({
  selector: 'app-qr-code',
  template: ''
})
export class QRCodeComponent implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  @Input() data: string = '';
  // tslint:disable-next-line:no-inferrable-types
  @Input() size: number = 128;
  // tslint:disable-next-line:no-inferrable-types
  @Input() type: number = 4;
  // tslint:disable-next-line:no-inferrable-types
  @Input() level: string = 'M';

  private qr: QRCode;

  constructor(
      private elementRef: ElementRef,
      private renderer: Renderer
  ) {}

  ngOnInit(): void {
    try {
      this.qr = qrcode(this.type, this.level);
      this.qr.addData(this.data);
      this.qr.make();

      const imgTagString = this.qr.createImgTag(this.type, 0);
      const el: HTMLElement = this.elementRef.nativeElement;
      this.renderer.setElementProperty(el, 'innerHTML', imgTagString);
      const imgTagObject: HTMLImageElement = <HTMLImageElement> el.firstElementChild;
      this.renderer.setElementStyle(imgTagObject, 'width', String(this.size));
      this.renderer.setElementStyle(imgTagObject, 'height', String(this.size));
    } catch (e) {
      console.error(`Could not generate QR Code: ${e.message}`);
    }
  }
}
