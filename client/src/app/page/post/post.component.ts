import { NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HeaderLayout } from "../../component/header/header.component";
import { DataService } from "../../service/service.data";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  imports: [HeaderLayout, NgIf]
})
export class PostPage implements OnInit {
  blogId: string;
  postId: string;

  isOwner: boolean;
  data: any;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.blogId = this.route.snapshot.paramMap.get('blogId') ?? "";
    this.postId = this.route.snapshot.paramMap.get('postId') ?? "";
    this.isOwner = false;

    this.load();
  }

  ngOnInit(): void {
    this.load();
    this.dataService.userInfo$.subscribe(userInfo => {
      if (userInfo?._id === this.blogId) {
        this.isOwner = true;
      }
    })
  }

  load = async () => {
    const response = await fetch(
      `${environment["API_HOST"]}/posts?_id=${this.postId}`,
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
    this.router.navigateByUrl(`/blog/${this.blogId}/editor/${this.postId}`);
  }

  onDelete = async () => {
    const response = await fetch(
      `${environment["API_HOST"]}/posts/${this.postId}`,
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