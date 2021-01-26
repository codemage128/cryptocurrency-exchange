import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ref',
  templateUrl: './ref.component.html',
  styleUrls: ['./ref.component.sass']
})
export class RefComponent implements OnInit {

  username: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = Object.values(params)[0].username;
      console.log('username', this.username);
      localStorage.setItem('ref:username', this.username);
      setTimeout(() => {
        this.router.navigate(['/authentication/signin']);
      }, 5000);
    });
  }
}
