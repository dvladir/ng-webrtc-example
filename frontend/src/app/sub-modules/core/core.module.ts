import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {ReactiveFormsModule} from '@angular/forms';
import { OverlayComponent } from './components/overlay/overlay.component';
import { ModalComponent } from './components/modal/modal.component';
import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { ModalFooterComponent } from './components/modal-footer/modal-footer.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { ModalRefDirective } from './directives/modal-ref.directive';
import { NotificationsViewComponent } from './components/notifications-view/notifications-view.component';

@NgModule({
  declarations: [OverlayComponent, ModalComponent, ModalContentComponent, ModalFooterComponent, ConfirmModalComponent, ModalRefDirective, NotificationsViewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    ModalComponent,
    ModalContentComponent,
    ModalFooterComponent,
    OverlayComponent,
    NotificationsViewComponent
  ],
  entryComponents: [ConfirmModalComponent]
})
export class CoreModule { }
