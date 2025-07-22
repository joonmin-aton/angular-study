import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import dayjs from 'dayjs';
import { HeaderLayout } from "../../component/header/header.component";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  imports: [HeaderLayout, NgFor, NgIf]
})
export class BlogPage implements OnInit, OnDestroy {
  id: string | null;
  list: any[];
  pageable: any;
  pages: any[];
  params: any;

  constructor(private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.list = [];
    this.pageable = [];
    this.pages = [];
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.params = params;
    });
    this.load();
  }
  ngOnDestroy(): void {
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
    window.location.href=`blog/${this.id}/post/${item?._id}`;
  }

  pageClick = (page: any) => {
    window.location.href=`/blog?page=${page}`;
  }

  load = async () => {
    const page = this.params['page'];
    const size = 5;
    const params: any = {
      page, size
    }
    const response = await fetch(
      // "http://localhost:3000/api/posts?" + new URLSearchParams(params).toString(),
      "http://localhost:3000/api/posts/list",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authentication": "Bearer "
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

    for (let i=this.pageable?.startPage; i<this.pageable?.endPage + 1; i++) {
      this.pages.push(i)
    }

    this.cdr.markForCheck();
  }
}