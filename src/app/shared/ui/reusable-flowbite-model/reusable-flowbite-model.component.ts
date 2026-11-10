import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';

import { Modal } from 'flowbite';

@Component({
  selector: 'app-reusable-flowbite-model',
  imports: [],
  templateUrl: './reusable-flowbite-model.component.html',
  styleUrl: './reusable-flowbite-model.component.css',
})
export class ReusableFlowbiteModelComponent implements AfterViewInit, OnDestroy {
  id = input.required<string>();

  @ViewChild('modalElement')
  modalElement!: ElementRef<HTMLElement>;

  private modal!: Modal;

  ngAfterViewInit(): void {
    this.modal = new Modal(
      this.modalElement.nativeElement,
      {
        placement: 'center',
        backdrop: 'dynamic',
        closable: true,
      },
      {
        id: this.id(),
        override: true,
      },
    );
  }

  open(): void {
    this.modal.show();
  }

  close(): void {
    this.modal.hide();
  }

  toggle(): void {
    this.modal.toggle();
  }

  ngOnDestroy(): void {
    this.modal?.destroy();
  }
}
