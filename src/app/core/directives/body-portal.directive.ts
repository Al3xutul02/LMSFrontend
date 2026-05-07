import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[bodyPortal]', standalone: true })
export class BodyPortalDirective implements OnInit, OnDestroy {
  private el: HTMLElement;

  constructor(ref: ElementRef<HTMLElement>) {
    this.el = ref.nativeElement;
  }

  ngOnInit(): void {
    document.body.appendChild(this.el);
  }

  ngOnDestroy(): void {
    this.el.remove();
  }
}