import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, toHTML, Toolbar } from 'ngx-editor';
import { HeaderLayout } from "../../component/header/header.component";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  standalone: true,
  imports: [NgIf, HeaderLayout, NgxEditorComponent, NgxEditorMenuComponent, FormsModule],
})
export class EditorPage implements OnInit, OnDestroy {
  html: any;
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 브라우저 환경에서만 동작하게 코드 작성
      this.editor = new Editor();
    }
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  editorChange = (e: any) => {
    console.log(e);
    const htmlText = toHTML(this.html);
    console.log(htmlText);
  }

  onSave = () => {
    console.log(this.editor);
  }

}