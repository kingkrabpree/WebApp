import { ResolveFn } from '@angular/router'
import { Member } from '../_model/member'
import { MembersService } from '../_services/MembersService'
import { inject } from '@angular/core'

export const memberDetailResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MembersService)
  return memberService.getMember(route.paramMap.get('username')!)
}
