import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HeaderLayout } from "../../component/header/header.component";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  imports: [HeaderLayout]
})
export class BlogPage {
  id: string | null;
  constructor(private route: ActivatedRoute) {
    this.id = route.snapshot.paramMap.get('id');
  }
}