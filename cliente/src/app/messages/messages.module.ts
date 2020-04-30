import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// ------------------------------------------------------------------------------------------------
// COMPONENTES
// ------------------------------------------------------------------------------------------------
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';

import { MessagesRoutingModule } from './messages-routing.module';

@NgModule({
  declarations:
    [
      MainComponent,
      AddComponent,
      ReceivedComponent,
      SendedComponent
    ],
  imports:
    [
      CommonModule,
      FormsModule,
      MessagesRoutingModule
    ],
  exports: [
    MainComponent,
    AddComponent,
    ReceivedComponent,
    SendedComponent
  ],
  providers: [

  ]
})
export class MessagesModule { }
