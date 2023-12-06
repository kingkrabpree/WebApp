import { Component, EventEmitter, Input, Output } from '@angular/core'
import { AccountService } from '../_services/account.service'
import { toHtml } from '@fortawesome/fontawesome-svg-core'
import { Route, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() isCancel = new EventEmitter()
  constructor(private toastr: ToastrService, private accountService: AccountService, private router: Router) { }
  model: any = {}
  register() {
    // console.log(this.model)
    this.accountService.register(this.model).subscribe(
      {
        error: err => this.toastr.error(err.error),
        next: () => {
          this.cancel()
          this.router.navigateByUrl("/members")
        }
      }
    )
  }

  cancel() {
    this.isCancel.emit(true)
  }
}
