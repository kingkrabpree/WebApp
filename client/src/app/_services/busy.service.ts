import { Injectable } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  count = 0;
  constructor(private pacman: NgxSpinnerService) { }

  busy(name?: string | undefined) {
    this.count++
    this.pacman.show(name, {
      type: 'pacman',
      bdColor: 'rgba(255,255,255,0)',
      color: '#E95420'
    })
  }
  idle(name?: string | undefined) {
    this.count--
    if (this.count <= 0) {
      this.count = 0
      this.pacman.hide(name)
    }
  }
}
