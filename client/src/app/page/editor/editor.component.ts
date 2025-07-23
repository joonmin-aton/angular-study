import { isPlatformBrowser, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { CookieService } from 'ngx-cookie-service';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';
import { HeaderLayout } from "../../component/header/header.component";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  standalone: true,
  imports: [NgIf, HeaderLayout, NgxEditorComponent, NgxEditorMenuComponent, FormsModule],
})
export class EditorPage implements OnInit, OnDestroy {
  blogId: string;
  id: string | null;
  pageTitle: any = '포스트 작성';
  title: any = '';
  contents: any = '';
  keywords: any = '';
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.blogId = this.route.snapshot.paramMap.get('blogId') ?? "";
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.pageTitle = "포스트 수정";
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 브라우저 환경에서만 동작하게 코드 작성
      this.editor = new Editor();
      if (this.cookieService.get("x-access-token")) {
        if (this.id) {
          this.load();
        }
      }
      else {
        this.router.navigateByUrl(`/blog/${this.blogId}`);
      }
    }
  }
  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  onChange = (e: any) => {
    if (e?.target?.name === 'title') {
      this.title = e?.target?.value;
    }
    if (e?.target?.name === 'keywords') {
      this.keywords = e?.target?.value;
    }
  }

  load = async () => {
    const response = await fetch(
      `http://localhost:3000/api/posts?_id=${this.id}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authentication": "Bearer "
        }
      }
    )

    const json = await response.json();
    this.title = json?.[0]?.title;
    this.contents = json?.[0]?.contents;
    this.keywords = json?.[0]?.keywords.join(',');

    this.cdr.markForCheck();
  }

  onSave = async () => {
    const accessToken = this.cookieService.get("x-access-token");

    const response = await fetch(
      `http://localhost:3000/api/blog/${this.id ? "update" : "write"}`,
      {
        method: this.id ? "PUT" : "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          id: this.id ?? undefined,
          title: this.title,
          contents: this.contents,
          keywords: this.keywords.split(','),
          updatedAt: this.id ? dayjs().toDate() : undefined
        })
      }
    )

    const json = await response.json()
    if (response.status === 201 || response.status === 200) {
      alert(this.id ? "수정이 완료되었습니다." : "작성이 완료되었습니다.");
      this.router.navigateByUrl(`/blog/${this.blogId}`);
    }
  }

}