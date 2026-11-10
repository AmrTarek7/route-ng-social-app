import { ElementRef, Injectable } from '@angular/core';
import { Modal } from 'flowbite';

@Injectable({
  providedIn: 'root',
})
export class ModalFlowbiteService {
  /**
   * Creates and initializes a Flowbite modal instance
   * using the provided HTML element.
   * Configures its position, backdrop behavior, and close functionality.
   */
  createModal(element: ElementRef<HTMLElement>): Modal {
    return new Modal(
      element.nativeElement,
      {
        placement: 'center',
        backdrop: 'dynamic',
        closable: true,
      },
      {
        override: true,
      },
    );
  }
}
