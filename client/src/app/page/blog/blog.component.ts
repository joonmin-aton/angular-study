import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import dayjs from 'dayjs';
import { HeaderLayout } from "../../component/header/header.component";
import { DataService } from "../../service/service.data";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  providers: [DataService],
  imports: [HeaderLayout, NgFor, NgIf]
})
export class BlogPage implements OnInit {
  blogId: string;
  list: any[];
  pageable: any;
  pages: any[];
  params: any;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.blogId = this.route.snapshot.paramMap.get('blogId') ?? "";
    this.list = [];
    this.pageable = [];
    this.pages = [];
    this.dataService.blogId = this.blogId;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.params = params;
      this.load();
    });
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
    this.router.navigateByUrl(`/blog/${this.blogId}/post/${item?._id}`);
  }

  pageClick = (page: any) => {
    this.router.navigateByUrl(`/blog/${this.blogId}?page=${page}`);
  }

  load = async () => {
    const page = this.params['page'] ?? 1;
    const keyword = this.params['keyword'] ?? undefined;
    const size = 5;
    const params: any = {
      id: this.blogId, page, size, keyword
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
    this.pages = [];
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