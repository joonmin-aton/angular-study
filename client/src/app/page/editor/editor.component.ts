import { isPlatformBrowser, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnChanges, OnDestroy, OnInit, PLATFORM_ID, SimpleChanges } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, toHTML, Toolbar } from 'ngx-editor';
import { HeaderLayout } from "../../component/header/header.component";
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  standalone: true,
  imports: [NgIf, HeaderLayout, NgxEditorComponent, NgxEditorMenuComponent, FormsModule],
})
export class EditorPage implements OnInit, OnDestroy {
  id: string | null;
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

  constructor(private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 브라우저 환경에서만 동작하게 코드 작성
      this.editor = new Editor();
      if (this.id) {
        setTimeout(() => {
          this.load();
        }, 100);
      }
    }
  }
  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  onChange = (e: any) => {
    if(e?.target?.name === 'title') {
      this.title = e?.target?.value;
    }
    if(e?.target?.name === 'keywords') {
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
    console.log(json);
    this.title = json?.[0]?.title;
    this.contents = json?.[0]?.contents;
    this.keywords = json?.[0]?.keywords.join(',');

    this.cdr.markForCheck();
  }

  onSave = async () => {
    console.log(this.contents);

    const response = await fetch(
      `http://localhost:3000/api/posts${this.id ? `/${this.id}` : ''}`,
      {
        method: this.id ? "PUT" : "POST",
        headers: {
          "Content-type": "application/json",
          "Authentication": "Bearer "
        },
        body: JSON.stringify({
          _id: this.id ?? undefined,
          title: this.title,
          contents: this.contents,
          keywords: this.keywords.split(','),
          updatedAt: this.id ? dayjs().toDate() : undefined
        })
      }
    )

    const json = await response.json()
    window.location.href = "/blog";
  }

}