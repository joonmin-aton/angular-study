import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { DataService } from "../../service/service.data";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-blog-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [CookieService],
  imports: [NgIf, NgFor]
})
export class HeaderLayout implements OnInit, OnChanges {
  @Input() blogId: string = '';
  isLogin: boolean = false;
  isOwner: boolean = false;

  keywords: any;
  blogInfo?: any;
  userInfo?: any;

  constructor(
    private cookieService: CookieService,
    private dataService: DataService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    const accessToken = this.cookieService.get("x-access-token");
    if (accessToken) this.isLogin = true;
    this.load();
    this.keywords = [];
  }

  ngOnInit(): void {
    this.dataService.userInfo$?.subscribe(userInfo => {
      this.userInfo = userInfo;
      if (userInfo?._id === this.blogId) {
        this.isOwner = true;
      }
      else {
        this.isOwner = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['blogId']) {
      const id = changes['blogId']?.currentValue;
      this.blogId = id;
      console.log(id);
      if (this.userInfo?._id === id) {
        this.isOwner = true;
      }
      else {
        this.isOwner = false;
      }
      this.loadBlog(id);
    }
  }

  load = async () => {
    if (this.isLogin) {
      await this.loadUserInfo();
    }
    this.cdr?.markForCheck();
  }

  loadBlog = async (id: any) => {
    await this.loadBlogInfo(id);
    await this.loadTop5Keywords(id);
    this.cdr?.markForCheck();
  }

  login = () => {
    this.router.navigateByUrl(`/login?from=${window.location.pathname}`);
  }

  logout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      this.cookieService.delete("x-access-token", "/");
      this.cdr?.markForCheck();
      window.location.reload();
    }
  }

  link = (path?: string) => {
    this.router.navigateByUrl(`/blog/${this.blogId}${path ?? ""}`);
  }

  goToMyBlog = () => {
    this.router.navigateByUrl(`/blog/${this.userInfo._id}`);
    this.cdr?.markForCheck();
  }

  loadUserInfo = async () => {
    const accessToken = this.cookieService.get("x-access-token");
    const response = await fetch(
      `${environment["API_HOST"]}/user/info`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      }
    );

    const json = await response.json();
    this.userInfo = json;
    this.dataService?.setUserInfo(this.userInfo);
  }

  loadBlogInfo = async (id: any) => {
    const response = await fetch(
      `${environment["API_HOST"]}/users?_id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    const json = await response.json();
    this.blogInfo = json?.[0];
  }

  loadTop5Keywords = async (id: any) => {
    const response = await fetch(
      `${environment["API_HOST"]}/blog/top5`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ id })
      }
    );

    const json = await response.json();
    this.keywords = json;
  }

  keywordClick = (keyword: any) => {
    this.router.navigateByUrl(`/blog/${this.blogId}?page=1&keyword=${keyword._id}`);
  }
}