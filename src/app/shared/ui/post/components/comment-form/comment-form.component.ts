import { Component, computed, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideFaceSlightlySmiling, LucideImage, LucideSendHorizontal, LucideX } from '@lucide/angular';
import { User } from '../../../../../core/models/user.interface';
import { CommentsAndRepliesService } from '../../../../../core/services/comments-and-replies.service';

@Component({
  selector: 'app-comment-form',
  imports: [ReactiveFormsModule, LucideSendHorizontal, LucideImage, LucideFaceSlightlySmiling, LucideX],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css',
})
export class CommentFormComponent {
  private readonly _commentsAndRepliesService = inject(CommentsAndRepliesService);

  readonly defaultAvatar = 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';
  readonly userData = signal<User | null>(JSON.parse(localStorage.getItem('routeUserInfo') || 'null'));

  postId = input.required<string>();
  commentId = input<string>();
  placeholder = input<string>();

  submitted = output<any>();

  fileUploadInput = viewChild<ElementRef<HTMLInputElement>>('fileUploadInput');

  isReply = computed(() => !!this.commentId());
  placeholderText = computed(() => this.placeholder() || `${this.isReply() ? 'Reply' : 'Comment'} as ${this.userData()?.name ?? ''}...`);

  sendLoading = signal(false);
  saveFile = signal<File | null>(null);
  imageUrl = signal('');
  content = new FormControl('', [Validators.minLength(2)]);
  private readonly contentValue = toSignal(this.content.valueChanges, { initialValue: this.content.value });

  isSubmitDisabled = computed(() => this.sendLoading() || (!this.saveFile() && !this.contentValue()?.trim()));

  changeImageInput(e: Event): void {
    const inputEl = e.target as HTMLInputElement;

    if (inputEl.files && inputEl.files[0]) {
      this.saveFile.set(inputEl.files[0]);
      this.readFile(inputEl.files[0]);
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      this.imageUrl.set(e.target?.result as string);
    };
  }

  removeImage(): void {
    this.saveFile.set(null);
    this.imageUrl.set('');
    const inputEl = this.fileUploadInput()?.nativeElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }

  submitForm(e: Event): void {
    e.preventDefault();

    if (this.sendLoading()) return;

    const trimmedContent = this.content.value?.trim() ?? '';
    if (!trimmedContent && !this.saveFile()) {
      return;
    }

    if (this.content.value && this.content.value.length > 0 && this.content.invalid) {
      this.content.markAsTouched();
      this.content.markAsDirty();
      return;
    }

    this.sendLoading.set(true);

    const formData = new FormData();
    if (this.content.value) {
      formData.append('content', this.content.value);
    }
    if (this.saveFile()) {
      formData.append('image', this.saveFile() as File);
    }

    const request$ = this.isReply() ? this._commentsAndRepliesService.createReply(this.postId(), this.commentId()!, formData) : this._commentsAndRepliesService.createComment(this.postId(), formData);

    request$.subscribe({
      next: (res) => {
        this.sendLoading.set(false);
        this.removeImage();
        this.content.reset();
        this.submitted.emit(res);
      },
      error: (err) => {
        console.error(err);
        this.sendLoading.set(false);
      },
    });
  }
}
