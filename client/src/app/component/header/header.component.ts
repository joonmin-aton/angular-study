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

  constructor(private cookieService: CookieService, private cdr: ChangeDetectorRef) {
    const accessToken = this.cookieService.get("x-access-token");
    if (accessToken) this.isLogin = true;
    this.load();
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }

  load = async () => {
    if (this.isLogin) {
      const accessToken = this.cookieService.get("x-access-token");
      const userResponse = await fetch(
        `http://localhost:3000/api/user/info`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          },
        }
      );

      const json = await userResponse.json();
      this.userData = {
        email: json?.email,
        name: json?.name,
      }
    }
    this.cdr.markForCheck();
  }
}