import { NgClass } from '@angular/common';
import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [NgClass],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  // استخدام الـ model للتحكم الثنائي (Two-way binding) في حالة الفتح والإغلاق
  isOpen = model<boolean>(false);
  maxWidthModal = input('max-w-130');

  close() {
    this.isOpen.set(false);
  }
}
