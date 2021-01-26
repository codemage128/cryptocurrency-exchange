import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ref',
  templateUrl: './ref.component.html',
  styleUrls: ['./ref.component.scss']
})
export class RefComponent implements OnInit {
  username: string = '';
  baseApi: string = 'http://share2riches.com:4000';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = Object.values(params)[0].username;
      console.log('username', this.username);
      localStorage.setItem('ref:username', this.username);
    });
    this.router.navigateByUrl('/');
    // window.location.href = 'http://app.share2riches.com/#/ref/' + this.username;
  }
}
