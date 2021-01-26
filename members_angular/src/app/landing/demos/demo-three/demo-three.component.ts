import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-three',
  templateUrl: './demo-three.component.html',
})
export class DemoThreeComponent implements OnInit,AfterViewInit  {

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#ffffff';
 }
}
