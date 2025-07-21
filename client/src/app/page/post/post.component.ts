import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HeaderLayout } from "../../component/header/header.component";

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
  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {
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

    this.cdr.markForCheck();
  }

  onEdit = async () => {
    window.location.href=`/editor/${this.postId}`;
  }

  onDelete = async () => {
    const response = await fetch(
      `http://localhost:3000/api/posts/${this.postId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "Authentication": "Bearer "
        }
      }
    )

    const json = await response.json();
  }
}