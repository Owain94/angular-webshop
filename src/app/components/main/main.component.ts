import { Component, OnInit } from '@angular/core';

import { TransferState } from '../../modules/transfer-state/transfer-state';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  constructor(private transferState: TransferState,
              private userService: UserService) {}

  ngOnInit(): void {
    this.transferState.set('cached', true);
  }
}
