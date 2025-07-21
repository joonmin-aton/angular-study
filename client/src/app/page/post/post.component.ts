import { Component, OnDestroy, OnInit } from "@angular/core";
import { HeaderLayout } from "../../component/header/header.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  imports: [HeaderLayout]
})
export class PostPage implements OnInit, OnDestroy {
  blogId: string | null;
  postId: string | null;
  constructor(private route: ActivatedRoute) {
    this.blogId = route.snapshot.paramMap.get('blogId');
    this.postId = route.snapshot.paramMap.get('postId');
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