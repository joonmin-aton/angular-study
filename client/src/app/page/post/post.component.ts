import { Component, OnDestroy, OnInit } from "@angular/core";
import { HeaderLayout } from "../../component/header/header.component";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  imports: [HeaderLayout]
})
export class PostPage implements OnInit, OnDestroy {
  blogId: string | null;
  postId: string | null;
  data: any;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.blogId = route.snapshot.paramMap.get('blogId');
    this.postId = route.snapshot.paramMap.get('postId');

    this.load();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.load();
    }, 1);
  }

  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  load = async () => {
    const response = await fetch(
      `http://localhost:3000/api/posts?_id=${this.postId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authentication": "Bearer "
        }
      }
    )

    const json = await response.json();
    this.data = json?.[0];
  }

  onSave = async () => {
    this.router.navigate([`/edit/${this.postId}`]);
  }

  onDelete = async () => {
    const response = await fetch(
      `http://localhost:3000/api/posts?_id=${this.postId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authentication": "Bearer "
        }
      }
    )

    const json = await response.json();
  }
}