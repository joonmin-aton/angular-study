import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class BlogPage {
  id: string | null;
  constructor(private route: ActivatedRoute) {
    this.id = route.snapshot.paramMap.get('id');
  }
}