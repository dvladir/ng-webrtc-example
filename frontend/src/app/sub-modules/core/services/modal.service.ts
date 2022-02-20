import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  OnDestroy,
  Type,
  ViewContainerRef
} from '@angular/core';
import {OverlayViewRefContainerService} from './overlay-view-ref-container.service';
import {Modal} from '../shared/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService implements OnDestroy {

  constructor(
    private _overlayViewRefContainer: OverlayViewRefContainerService,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  private _componentsDictionary: Map<Type<Modal>, ComponentFactory<Modal>> = new Map<Type<Modal>, ComponentFactory<Modal>>();

  private getComponentFactory(component: Type<Modal>): ComponentFactory<Modal> {
    if (!this._componentsDictionary.has(component)) {
      const componentRef: ComponentFactory<Modal> = this._componentFactoryResolver.resolveComponentFactory(component);
      this._componentsDictionary.set(component, componentRef);
    }
    return this._componentsDictionary.get(component);
  }

  openModal(component: Type<Modal>, data: any): Promise<any> {
    const componentFactory: ComponentFactory<Modal> = this.getComponentFactory(component);

    const viewRef: ViewContainerRef = this._overlayViewRefContainer.overlayViewRef;
    const modalComponent: ComponentRef<Modal> = viewRef.createComponent(componentFactory);
    modalComponent.instance.data = data;

    const result: Promise<any> = new Promise<any>(resolve => {
      (modalComponent.instance as any)._onClose = () => {
        const returnValue: any = modalComponent.instance.returnValue;
        const index: number = viewRef.indexOf(modalComponent.hostView);
        viewRef.remove(index);
        resolve(returnValue);
      };
    });

    return result;
  }

  ngOnDestroy(): void {
    this._componentsDictionary.clear();
  }
}
