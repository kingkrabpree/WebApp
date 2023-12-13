import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AccountService } from '../_services/account.service'
import { map } from 'rxjs'

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService)
  const toastrService = inject(ToastrService)
  return accountService.currentUser$.pipe(
    map(user => {
      if (user) return true
      toastrService.error('no permission !!')
      return false
    })
  )
}
