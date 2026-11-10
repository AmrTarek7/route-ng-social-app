import { Component, computed, inject, signal, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MyProfilePostViewComponent } from './components/my-profile-post-view/my-profile-post-view.component';
import { LucideBookmark, LucideCamera, LucideExpand, LucideFileText, LucideMail, LucideTrash, LucideUsers, LucideX } from '@lucide/angular';
import { UserService } from '../../core/services/user.service';
import { NgClass, NgStyle } from '@angular/common';
import { PostModel } from '../../core/models/post.interface';
import { PostsService } from '../../core/services/posts.service';
import { MyProfile } from './../../core/models/my-profile.interface';
import { Modal } from 'flowbite';
import { ModalFlowbiteService } from '../../shared/services/modal-flowbite.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ReusableFlowbiteModelComponent } from '../../shared/ui/reusable-flowbite-model/reusable-flowbite-model.component';

enum ProfileTabs {
  MyPost = 'myPost',
  Saved = 'saved',
}

@Component({
  selector: 'app-profile',
  imports: [MyProfilePostViewComponent, ReactiveFormsModule, NgClass, NgStyle, LucideExpand, LucideCamera, LucideTrash, LucideUsers, LucideMail, LucideFileText, LucideBookmark, LucideX, ReusableFlowbiteModelComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements AfterViewInit {
  myPosts = signal<PostModel[]>([]);
  bookmarkPosts = signal<PostModel[]>([]);

  myProfile = computed<MyProfile>(() => this._userService.myProfile());
  ProfileTabsEnum = ProfileTabs;

  coverStyle = computed(() => {
    const cover = this.myProfile()?.cover;

    return cover
      ? {
          'background-image': `linear-gradient(rgba(15, 23, 42, 0.22), rgba(15, 23, 42, 0.4)), url('${cover}')`,
          'background-size': 'cover',
          'background-position': ' center center',
        }
      : {};
  });

  activeTab = signal<ProfileTabs>(ProfileTabs.MyPost);

  myPostTotalCount = signal<number>(0);
  bookMarkPostTotalCount = signal<number>(0);

  saveFile = signal<File | null>(null);
  imageUrl = signal('');

  privacy: FormControl = new FormControl('public');

  loading = signal(false);

  zoomValue = signal(1.0);

  // creat modal with Flowbite Modal Api
  @ViewChild('photoModal') photoModalRef!: ElementRef<HTMLElement>;
  private photoModal!: Modal;

  @ViewChild('changeCoverModal') changeCoverModalRef!: ElementRef<HTMLElement>;
  private changeCoverModal!: Modal;

  @ViewChild('changePhotoModal') changePhotoModal!: ReusableFlowbiteModelComponent;

  _userService = inject(UserService);
  _postsService = inject(PostsService);
  _modalFlowbiteService = inject(ModalFlowbiteService);

  ngOnInit(): void {
    this._userService.getMyProfile();
    this.getMyPosts();
    this.getBookMarkPosts();
  }

  ngAfterViewInit(): void {
    this.photoModal = this._modalFlowbiteService.createModal(this.photoModalRef);
    this.changeCoverModal = this._modalFlowbiteService.createModal(this.changeCoverModalRef);
  }

  changeActiveTab(tab: ProfileTabs): void {
    if (tab === this.activeTab()) return;
    this.activeTab.set(tab);
  }

  getMyPosts(): void {
    this._postsService.getFeedPosts(30, 1, 'me').subscribe({
      next: (res) => {
        this.myPosts.set(res.data.posts);
        this.myPostTotalCount.set(res.meta.pagination.total);
      },
      error: (err) => console.log(err),
    });
  }

  getBookMarkPosts(): void {
    this._userService.getMyBookmarkPosts(1, 30).subscribe({
      next: (res) => {
        this.bookmarkPosts.set(res.data.bookmarks);
        this.bookMarkPostTotalCount.set(res.meta.pagination.total);
      },
      error: (err) => console.log(err),
    });
  }

  deleteCover(): void {
    this.loading.set(true);
    this._userService.deleteCover().subscribe({
      next: () => {
        this.loading.set(false);
        this._userService.getMyProfile();
      },
    });
  }

  openPhotoModal(): void {
    if (!this.myProfile().photo) return;
    this.photoModal.show();
  }

  closePhotoModal(): void {
    this.photoModal.hide();
  }

  // open and close function to modal
  openChangeCoverModal(): void {
    this.changeCoverModal.show();
  }

  closeChangeCoverModal(): void {
    this.changeCoverModal.hide();
  }

  openChangePhotoModal(): void {
    this.changePhotoModal.open();
  }

  changeImageInput(e: Event, type: string): void {
    const input = e.target as HTMLInputElement;

    if (input.files) {
      this.saveFile.set(input.files[0]);

      this.fileReader(this.saveFile() as File);

      if (type === 'openChangeCoverModal') {
        this.openChangeCoverModal();
      } else {
        this.openChangePhotoModal();
      }
    }
  }

  submitNewCover(e: Event) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('privacy', this.privacy.value);

    formData.append('cover', this.saveFile() as File);

    this.loading.set(true);
    this.privacy.disable();

    this._userService.uploadCover(formData).subscribe({
      next: () => {
        this.removeImage();
        this.privacy.setValue('public');
        this.loading.set(false);
        this.closeChangeCoverModal();
        this.privacy.enable();
        this._userService.getMyProfile();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  submitNewPhoto(e: Event) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('privacy', this.privacy.value);

    formData.append('photo', this.saveFile() as File);

    this.loading.set(true);
    this.privacy.disable();

    this._userService.uploadPhoto(formData).subscribe({
      next: () => {
        this.removeImage();
        this.privacy.setValue('public');
        this.loading.set(false);
        this.changePhotoModal.close();
        this.privacy.enable();
        this._userService.getMyProfile();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private fileReader(file: File): void {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (e) => {
      this.imageUrl.set(e.target?.result as string);
    };
  }

  private removeImage(fileUploadInput?: HTMLInputElement): void {
    this.saveFile.set(null);
    this.imageUrl.set('');
    if (fileUploadInput) {
      fileUploadInput.value = '';
    }
  }

  cropPreview(input: HTMLInputElement) {
    this.zoomValue.set(parseFloat(input.value));
    console.log(this.zoomValue());
  }
}
