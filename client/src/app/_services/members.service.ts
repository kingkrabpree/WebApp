import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { User } from './_model/user'
import { Member } from './_model/member'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  // getHttpOptions() {
  //   const userString = localStorage.getItem('user')
  //   if (!userString) return
  //   const user: User = JSON.parse(userString)
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.token
  //     })
  //   }
  // }

  getMembers() {
    const enpoint = this.baseUrl + 'users'
    return this.http.get<Member[]>(this.baseUrl + 'users')
  }

  getMember(username: string) {
    const enpoint = this.baseUrl + 'users/username/' + username
    return this.http.get<Member>(enpoint)
  }
}
