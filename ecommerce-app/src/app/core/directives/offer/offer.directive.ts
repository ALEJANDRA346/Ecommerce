import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appOffer]',
  standalone:true
})
export class OfferDirective {
  @Input() set appOffer(offer: number){
    this.viewContainer.clear();
    if (offer >=10) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ){ }

}
