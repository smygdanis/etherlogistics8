import { ServicesService } from './../../main/services/services.service';
import { ServicesSharedComponent } from './services-shared.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCheckboxModule,
  MatTableModule, MatIconModule, MatInputModule
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'servicesShared',
    component: ServicesSharedComponent,
    resolve: {
      services: ServicesService
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    CommonModule,

    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
    ServicesSharedComponent
  ],
  exports: [
    ServicesSharedComponent
  ],
  entryComponents: [
    ServicesSharedComponent
  ]
})
export class ServicesModModule { }
