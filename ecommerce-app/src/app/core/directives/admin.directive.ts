import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsAdmin } from '../store/auth/auth.selectors';
import { take } from 'rxjs';

@Directive({
  selector: '[appAdmin]',
  standalone:true
})
export class AdminDirective implements OnInit{

  constructor(
    private store: Store,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) { 

  }
  ngOnInit(): void {
    this.checkAdminAccess()
  }
  private checkAdminAccess():void{
    let role:boolean = false;
    this.store.select(selectIsAdmin).pipe(take(1)).subscribe({next:(isAdmin)=> role = isAdmin})
    this.viewContainer.clear();
    if (role) {
        this.viewContainer.createEmbeddedView(this.templateRef)
    }
  }

}
