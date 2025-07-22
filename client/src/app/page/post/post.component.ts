import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HeaderLayout } from "../../component/header/header.component";
import { LocalStorageService } from "../../service/localStorage";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  imports: [HeaderLayout, NgIf]
})
export class PostPage implements OnInit, OnDestroy {
  blogId: string | null;
  postId: string | null;
  isOwner: boolean;
  data: any;
  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService
  ) {
    this.blogId = this.route.snapshot.paramMap.get('blogId');
    this.postId = this.route.snapshot.paramMap.get('postId');
    
    if (this.localStorage.getItem("login-id") === this.blogId) {
      this.isOwner = true;
    }
    else {
      this.isOwner = false;
    }

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
    window.location.href=`/blog/${this.blogId}/editor/${this.postId}`;
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