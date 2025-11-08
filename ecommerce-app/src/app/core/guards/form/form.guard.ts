import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface canComponentDeactivate{
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
// export class register implements canComponentDeactivate {}
/*
  canDeactivate
*/
export const formGuard: CanDeactivateFn<canComponentDeactivate> = (component, currentRoute, currentState, nextState) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
