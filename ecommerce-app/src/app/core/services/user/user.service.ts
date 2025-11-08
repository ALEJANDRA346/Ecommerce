import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User, userSchema } from '../../types/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private httpClient: HttpClient) { }

  getUserById(userId: string):Observable<User>{
    return this.httpClient.get(`${this.baseUrl}/${userId}`).pipe(
      map((data:any)=>{
        const response = userSchema.safeParse(data.user);
        if (!response.success) {
          console.log(response.error)
          throw new Error(`${response.error}`);
        }
        return response.data;
      })
    )
  }
}
