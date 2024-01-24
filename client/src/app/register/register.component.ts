import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { AccountService } from '../_services/account.service'
import { toHtml } from '@fortawesome/fontawesome-svg-core'
import { Route, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({})
  @Output() isCancel = new EventEmitter()
  formBuilder: any
  maxDate: Date = new Date()
  constructor(private toastr: ToastrService, private accountService: AccountService, private router: Router) { }
  ngOnInit(): void {
    this.initForm()
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
  }
  // model: any = {}
  validationErrors: string[] | undefined
  register() {
    const birthDate = this.dateOnly(this.registerForm.controls['birthDate'].value)
    const registerData = { ...this.registerForm.value, birthDate }
    this.accountService.register(registerData).subscribe({
      next: response => {
        this.router.navigateByUrl('/members')
      },
      error: err => {
        this.validationErrors = err
      }
    })
  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      aka: [null, Validators.required],
      gender: ['non-binary'],
      birthDate: [null, Validators.required],
      city: ['101', Validators.required],
      country: ['thailand', Validators.required],
      username: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: [null, [Validators.required, this.matchValue('password')]],
    })
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: _ => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }
  matchValue(matchTo: string): ValidatorFn {
    return (ctrl: AbstractControl) =>
      ctrl.value === ctrl.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true }
  }

  cancel() {
    this.isCancel.emit(true)
  }
  private dateOnly(date_string: string | undefined) {
    if (!date_string) return
    const date = new Date(date_string)
    return new Date(date.setMinutes(date.getMinutes() - date.getTimezoneOffset()))
      .toISOString().slice(0, 10)
  }

}



