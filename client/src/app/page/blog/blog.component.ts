import { isPlatformBrowser, NgFor, NgIf } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, DoCheck, DOCUMENT, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import dayjs from 'dayjs';
import { HeaderLayout } from "../../component/header/header.component";
import { LocalStorageService } from "../../service/localStorage";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  providers: [LocalStorageService],
  imports: [HeaderLayout, NgFor, NgIf]
})
export class BlogPage implements OnInit {
  id: string | null;
  list: any[];
  pageable: any;
  pages: any[];
  params: any;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.list = [];
    this.pageable = [];
    this.pages = [];

    this.localStorage.setItem("blog-id", this.id);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });
    this.load();
  }

  dateFormat = (date: any) => {
    return dayjs(date).format("YYYY.MM.DD HH:mm")
  }

  htmlToText = (html: any) => {
    if (html)
      return html.replace(/<[^>]*>/g, '');
    return "";
  }

  rowClick = (item: any) => {
    window.location.href = `blog/${this.id}/post/${item?._id}`;
  }

  pageClick = (page: any) => {
    window.location.href = `/blog/${this.id}?page=${page}`;
  }

  load = async () => {
    const page = this.params['page'] ?? 1;
    const size = 5;
    const params: any = {
      id: this.id, page, size
    }
    const response = await fetch(
      "http://localhost:3000/api/blog/list",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(params)
      }
    )

    const json = await response.json();

    this.pageable = json?.pageable ?? [];
    this.list = json?.list ?? [];
    this.list = this.list.map((item) => ({
      ...item,
      contents: this.htmlToText(item.contents)
    }));

    for (let i = this.pageable?.startPage; i < this.pageable?.endPage + 1; i++) {
      this.pages.push(i)
    }

    this.cdr.markForCheck();
  }
}