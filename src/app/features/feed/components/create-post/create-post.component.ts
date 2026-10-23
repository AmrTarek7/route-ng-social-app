import { Component, inject, output, signal } from '@angular/core';
import { User } from '../../../../core/models/user.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../../../../core/services/posts.service';
import { LucideFaceSlightlySmiling } from '@lucide/angular';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule, LucideFaceSlightlySmiling],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent {
  readonly userData = signal<User>(JSON.parse(localStorage.getItem('routeUserInfo') as string));

  saveFile = signal<File | null>(null);
  imageUrl = signal('');

  refreshPostsList = output<void>();

  privacy: FormControl = new FormControl('public');
  content: FormControl = new FormControl('');

  _postService = inject(PostsService);

  changeImageInput(e: Event): void {
    const input = e.target as HTMLInputElement;

    if (input.files) {
      this.saveFile.set(input.files[0]);
      // console.log(this.saveFile());

      this.fileReader(this.saveFile() as File);
    }
  }

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

    const formData = new FormData();
    formData.append('privacy', this.privacy.value);
    if (this.content.value) {
      formData.append('body', this.content.value);
    }
    if (this.saveFile()) {
      formData.append('image', this.saveFile() as File);
    }

    // console.log('formData', formData);

    this._postService.createPost(formData).subscribe({
      next: () => {
        this.removeImage();
        this.content.reset();
        this.privacy.setValue('public');
        //Refresh parent postsList to get the new post
        this.refreshPostsList.emit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
