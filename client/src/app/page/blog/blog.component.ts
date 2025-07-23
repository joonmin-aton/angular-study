import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import dayjs from 'dayjs';
import { HeaderLayout } from "../../component/header/header.component";
import { DataService } from "../../service/service.data";
import { environment } from "../../../environments/environment";
import { combineLatest, map, Subscription } from "rxjs";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  imports: [HeaderLayout, NgFor, NgIf]
})
export class BlogPage implements OnInit, OnDestroy {
  blogId: string = "";
  list: any[];
  pageable: any;
  pages: any[];
  params: any;

  private subs: Subscription | undefined;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.list = [];
    this.pageable = [];
    this.pages = [];
    this.dataService.blogId = this.blogId;
  }

  ngOnInit(): void {
    this.subs = combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ])
    .pipe(
      map(([params, queryParams]: any) => {
        const blogId = params.get('blogId') ?? "";
        this.blogId = blogId;
        this.params = queryParams;
        this.load();
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
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
    const page = this.params?.page ?? 1;
    const keyword = this.params?.keyword ?? undefined;
    const size = 5;
    const params: any = {
      id: this.blogId, page, size, keyword
    }
    
    const response = await fetch(
      `${environment["API_HOST"]}/blog/list`,
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