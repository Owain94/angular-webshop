import { Component, OnInit } from '@angular/core';

import { TransferState } from '../../modules/transfer-state/transfer-state';

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  constructor(private transferState: TransferState) {}

  ngOnInit(): void {
    this.transferState.set('cached', true);
  }
}
