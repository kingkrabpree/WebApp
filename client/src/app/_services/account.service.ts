import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, map } from 'rxjs'
import { User } from './_model/user'

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl//'https://localhost:7777/API/'
  private currentUserSource = new BehaviorSubject<User | null>(null)
  currentUser$ = this.currentUserSource.asObservable()

  constructor(private http: HttpClient) { }


  login(model: any) {
    return this.http.post<User>(`${this.baseUrl}account/login`, model).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
          this.currentUserSource.next(user)
        }
      })
    )
  }
  Logout() {
    localStorage.removeItem('user')
    this.currentUserSource.next(null)
  }
  setCurrentUser(user: User) {
    this.currentUserSource.next(user)
  }
  register(model: any) {
    return this.http.post<User>(`${this.baseUrl}account/register`, model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
          this.currentUserSource.next(user)
        }
      })
    )
  }
}
