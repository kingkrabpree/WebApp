import { Component, Input } from '@angular/core'
import { faUser, faHeart, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { ToastrService } from 'ngx-toastr'
import { Member } from 'src/app/_model/member'
import { MembersService } from 'src/app/_services/MembersService'
import { PresenceService } from 'src/app/_services/presence.service'

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
  constructor(public presenceService: PresenceService, private memberService: MembersService, private toastr: ToastrService) { }
  faUser = faUser
  faHeart = faHeart
  faEnvelope = faEnvelope
  @Input() member: Member | undefined
  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: _ => this.toastr.success(`You have liked ${member.userName}`)
    })
  }
}
