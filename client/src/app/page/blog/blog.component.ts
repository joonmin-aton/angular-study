import { NgFor } from "@angular/common";
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HeaderLayout } from "../../component/header/header.component";
import dayjs from 'dayjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  imports: [HeaderLayout, NgFor]
})
export class BlogPage implements OnInit, OnDestroy {
  id: string | null;
  list: any[];
  constructor(private route: ActivatedRoute, private router: Router) {
    this.id = route.snapshot.paramMap.get('id');
    this.list = [];
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.load();
    }, 1);
  }
  ngOnDestroy(): void {
  }

  dateFormat = (date: any) => {
    return dayjs(date).format("YYYY.MM.DD HH:mm")
  }

  rowClick = (item: any) => {
    console.log(item);
    this.router.navigate([`/editor/${item?._id}`]);
  }

  load = async () => {
    const page = 1;
    const size = 10;
    const params: any = {
      skip: (page - 1) * size,
      limit: size,
      sort: '-createdAt'
    }
    const response = await fetch(
      "http://localhost:3000/api/posts?" + new URLSearchParams(params).toString(),
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authentication": "Bearer "
        }
      }
    )

    const json = await response.json();
    this.list = json;
  }
}