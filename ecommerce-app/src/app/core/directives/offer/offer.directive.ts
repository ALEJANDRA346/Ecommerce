import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appOffer]',
  standalone: true
})
export class OfferDirective {
  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) { }

  @Input() set appOffer(value: number | null) {
    this.vcr.clear();
    if (value && value > 0) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}
