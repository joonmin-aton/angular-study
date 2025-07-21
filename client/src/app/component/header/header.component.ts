import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: 'app-blog-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderLayout implements OnInit, OnDestroy {

  constructor(private cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }

  load = async () => {
    const response = await fetch(
      "http://localhost:3000/api/auth/signIn",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authentication": "Bearer "
        },
      }
    )

    const json = await response.json()
  }
}