import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HeaderLayout } from "../../component/header/header.component";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  imports: [HeaderLayout]
})
export class BlogPage implements OnInit, OnDestroy {
  id: string | null;
  list: any[];
  constructor(private route: ActivatedRoute) {
    this.id = route.snapshot.paramMap.get('id');
    this.list = [];
  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
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