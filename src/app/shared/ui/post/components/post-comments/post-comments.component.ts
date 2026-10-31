import { Component, inject, input, OnInit, signal } from '@angular/core';
import { PostModel } from '../../../../../core/models/post.interface';
import { CommentIF } from '../../../../../core/models/comment.interface';
import { TimeAgoPipe } from '../../../../pipes/time-ago.pipe';
import { CommentsAndRepliesService } from '../../../../../core/services/comments-and-replies.service';
import { LucideEllipsis, LucideFaceSlightlySmiling, LucideImage, LucideMessageCircle, LucidePencil, LucideSendHorizontal, LucideTrash, LucideX } from '@lucide/angular';
import { Meta } from '../../../../../core/models/meta-res.interface';
import { initDropdowns, Dropdown } from 'flowbite';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../../core/models/user.interface';

@Component({
  selector: 'app-post-comments',
  imports: [ReactiveFormsModule, TimeAgoPipe, LucideMessageCircle, LucideSendHorizontal, LucideImage, LucideFaceSlightlySmiling, LucideEllipsis, LucidePencil, LucideTrash, LucideX],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css',
})
export class PostCommentsComponent implements OnInit {
  readonly userData = signal<User>(JSON.parse(localStorage.getItem('routeUserInfo') as string));

  postId = input.required<string>();
  commentsCount = input.required<number>();

  myId = signal<string>(JSON.parse(localStorage.getItem('routeUserInfo') as string)._id);

  comments = signal<CommentIF[]>([]);

  meta = signal<Meta | null>(null);
  editingCommentId = signal<string | null>(null);

  loading = signal(false);

  sendCommentLoading = signal(false);

  saveFile = signal<File | null>(null);
  imageUrl = signal('');
  content: FormControl = new FormControl('', Validators.minLength(2));

  _commentsAndRepliesService = inject(CommentsAndRepliesService);

  ngOnInit(): void {
    console.log('commentsCount', this.commentsCount());
    console.log('postId', this.postId());

    this.getPostComments();
  }

  //

  getPostComments(): void {
    this.loading.set(true);
    this._commentsAndRepliesService.getAllPostComments(this.postId()).subscribe({
      next: (res) => {
        this.comments.set(res.data.comments);
        this.meta.set(res.meta);
        console.log(this.meta());

        setTimeout(() => {
          this.loading.set(false);
          setTimeout(() => {
            initDropdowns();
          });
        }, 500);
      },
      error: () => {
        setTimeout(() => {
          this.loading.set(false);
        }, 1000);
      },
    });
  }

  editComment(commentId: string) {
    this.toggleCommentDropdown(commentId);
    this.editingCommentId.set(commentId);
  }

  cancelEdit() {
    this.editingCommentId.set(null);
  }

  toggleCommentDropdown(commentId: string): void {
    const triggerEl = document.querySelector(`[data-dropdown-toggle="commentOptions${commentId}"]`) as HTMLElement;

    const targetEl = document.getElementById(`commentOptions${commentId}`);

    if (!triggerEl || !targetEl) return;

    const dropdown = new Dropdown(targetEl, triggerEl);

    dropdown.hide();
  }

  changeImageInput(e: Event): void {
    const input = e.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.saveFile.set(input.files[0]);

      this.fileReader(input.files[0]);
    }
  }

  // file and image reader
  private fileReader(file: File): void {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (e) => {
      // console.log(e.target?.result);
      this.imageUrl.set(e.target?.result as string);
    };
  }

  removeImage(fileUploadInput?: HTMLInputElement): void {
    this.saveFile.set(null);
    this.imageUrl.set('');
    if (fileUploadInput) {
      fileUploadInput.value = '';
    }
  }

  submitForm(e: Event) {
    e.preventDefault();

    if (this.content.value?.length > 0 && this.content.invalid) {
      console.error('Comment must be at least 2 characters.');
      this.content.markAsTouched();
      this.content.markAsDirty();

      return;
    }

    this.sendCommentLoading.set(true);

    const formData = new FormData();
    if (this.content.value) {
      formData.append('content', this.content.value);
    }
    if (this.saveFile()) {
      formData.append('image', this.saveFile() as File);
    }

    this.removeImage();
    this.content.reset();

    this._commentsAndRepliesService.createComment(this.postId(), formData).subscribe({
      next: () => {
        //Refresh parent postsList to get the new post
        this.sendCommentLoading.set(false);

        this.getPostComments();
      },
      error: (err) => {
        console.log(err);
        this.sendCommentLoading.set(false);
      },
    });
  }
}
