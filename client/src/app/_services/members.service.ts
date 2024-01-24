import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { User } from './_model/user'
import { Member } from './_model/member'
import { Injectable } from '@angular/core'
import { map, of, take } from 'rxjs'
import { PaginationResult } from './_model/pagination'
import { UserParams } from './_model/userParams'
import { AccountService } from './account.service'

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  userParams: UserParams | undefined
  user: User | undefined
  memberCache = new Map()
  baseUrl = environment.apiUrl
  members: Member[] = []
  //paginationResult: PaginationResult<Member[]> = new PaginationResult<Member[]>

  constructor(private accountService: AccountService, private http: HttpClient) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user)
          this.user = user
        }
      }
    })
  }

  getMembers(userParams: UserParams) {
    const key = this._key(userParams)
    const response = this.memberCache.get(key)
    if (response) return of(response)
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize)
    params = params.append('minAge', userParams.minAge)
    params = params.append('maxAge', userParams.maxAge)
    params = params.append('gender', userParams.gender)
    params = params.append('orderBy', userParams.orderBy)
    const url = this.baseUrl + 'users'
    return this.getPaginationResult<Member[]>(url, params).pipe(
      map(response => {
        this.memberCache.set(key, response)
        return response
      })
    )
  }
  getUserParams() {
    return this.userParams
  }
  setUserParams(params: UserParams) {
    this.userParams = params
  }
  resetUserParams() {
    if (!this.user) return
    this.userParams = new UserParams(this.user)
    return this.userParams
  }
  private _key(userParams: UserParams) {
    return Object.values(userParams).join('_')
  }
  private getPaginationResult<T>(url: string, params: HttpParams) {
    const paginationResult: PaginationResult<T> = new PaginationResult<T>
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body)
          paginationResult.result = response.body

        const pagination = response.headers.get('Pagination')
        if (pagination)
          paginationResult.pagination = JSON.parse(pagination)

        return paginationResult
      })
    )
  }
  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams()
    params = params.append('pageNumber', pageNumber)
    params = params.append('pageSize', pageSize)
    return params
  }

  getMember(username: string) {
    // const member = this.members.find(user => user.userName === username)
    // if (member) return of(member)
    const cache = [...this.memberCache.values()]
    // console.log('cache\n', cache)
    const members = cache.reduce((arr, item) => arr.concat(item.result), [])
    // console.log('members\n', members)
    const member = members.find((member: Member) => member.userName === username)
    // console.log('member\n', member)
    // const member = [...this.memberCache.values()].reduce((arr, item) => arr.concat(item.result), [])
    //              .find((member: Member) => member.userName === username)
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
  deletePhoto(photoId: number) {
    const endpoint = this.baseUrl + 'users/delete-photo/' + photoId
    return this.http.delete(endpoint)
  }
  setMainPhoto(photoId: number) {
    const endpoint = this.baseUrl + 'users/set-main-photo/' + photoId
    return this.http.put(endpoint, {})
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
