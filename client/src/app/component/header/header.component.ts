import { NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-blog-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: [CookieService],
  imports: [NgIf]
})
export class HeaderLayout implements OnInit, OnDestroy {
  isLogin: boolean = false;
  userData: any;
  keywords: any;

  constructor(private cookieService: CookieService, private cdr: ChangeDetectorRef) {
    const accessToken = this.cookieService.get("x-access-token");
    if (accessToken) this.isLogin = true;
    this.load();
    this.keywords = [];
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }

  load = async () => {
    if (this.isLogin) {
      await this.userInfo();
    }
    await this.top5Keywords();
    this.cdr.markForCheck();
  }

  logout = () => {
    this.cookieService.delete("x-access-token", "/");
    this.cdr.markForCheck();
    window.location.reload();
  }

  link = (path?: string) => {
    const blogId = window.localStorage.getItem("blog-id");
    window.location.href = `/blog/${blogId}${path ?? ""}`
  }

  userInfo = async () => {
    const accessToken = this.cookieService.get("x-access-token");
    const response = await fetch(
      `http://localhost:3000/api/user/info`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      }
    );

    const json = await response.json();
    this.userData = {
      email: json?.email,
      name: json?.name,
    }
  }

  top5Keywords = async () => {
    const blogId = window.localStorage.getItem("blog-id")
    const response = await fetch(
      `http://localhost:3000/api/blog/top5`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          id: blogId
        })
      }
    );

    const json = await response.json();
    console.log(json);
    this.keywords = [];
  }
}