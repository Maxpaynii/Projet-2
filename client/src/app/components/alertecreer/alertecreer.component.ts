import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlerteCreer } from '../../../../../common/nouveaudessin';

@Component({
  selector: 'app-alertecreer',
  templateUrl: './alertecreer.component.html',
  styleUrls: ['./alertecreer.component.scss'],
})
export class AlertecreerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AlertecreerComponent>, @Inject(MAT_DIALOG_DATA) public data: AlerteCreer) { }

  ngOnInit(){}

  onSubmit() {
    this.dialogRef.close({
      confirmation: true,
    });
  }
}
