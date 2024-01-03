import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { User } from './_model/user'
import { Member } from './_model/member'
import { Injectable } from '@angular/core'
import { map, of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl
  members: Member[] = []

  constructor(private http: HttpClient) { }

  getMembers() {
    if (this.members.length > 0) return of(this.members)
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(users => {
        this.members = users
        return users
      })
    )
  }

  getMember(username: string) {
    const member = this.members.find(user => user.userName === username)
    if (member) return of(member)
    return this.http.get<Member>(this.baseUrl + 'users/username/' + username)
  }

  updateProfile(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(_ => {
        const index = this.members.indexOf(member)
        this.members[index] = { ...this.members[index], ...member }
      })
    )
  }
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
}
