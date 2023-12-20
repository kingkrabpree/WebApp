import { Component, OnInit } from '@angular/core'
import { AccountService } from '../_services/account.service'
import { Observable, map, of } from 'rxjs'
import { User } from '../_services/_model/user'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  user: User | null = null
  currentUser$: Observable<User | null> = of(null)
  model: any = {}
  constructor(private toastr: ToastrService, private router: Router, private accountService: AccountService) {

  }
  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$
    this.currentUser$.subscribe({
      next: user => { this.user = user }
    })

  }
  login(): void {
    this.accountService.login(this.model).subscribe({ //Observable
      next: () => {
        this.router.navigateByUrl('/members')
      },
      //error: err => this.toastr.error(err.error)//anything that's not in 200 range of HTTP status
    })
  }
  getCurrentUser() {
    this.accountService.currentUser$.subscribe({
      error: err => console.log(err)
    })
  }
  Logout() {
    this.accountService.Logout()
  }
}
