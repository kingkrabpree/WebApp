import { CommonModule } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Gallery, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery'
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs'
import { TimeagoModule } from 'ngx-timeago'
import { Member } from 'src/app/_model/member'
import { MembersService } from 'src/app/_services/MembersService'
import { MemberMessagesComponent } from '../member-messages/member-messages.component'
import { Message } from 'src/app/_model/message'
import { MessageService } from 'src/app/_services/message.service'
import { PresenceService } from 'src/app/_services/presence.service'
import { AccountService } from 'src/app/_services/account.service'
import { take } from 'rxjs'
import { User } from 'src/app/_model/user'

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  standalone: true,
  imports: [CommonModule, TabsModule, GalleryModule, TimeagoModule, MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent
  activeTab?: TabDirective
  messages: Message[] = []
  user?: User
  member: Member = {} as Member
  photos: GalleryItem[] = []
  constructor(public presenceService: PresenceService, private messageService: MessageService, private accountService: AccountService, private route: ActivatedRoute) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user
      }
    })
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection()
  }
  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member']
        this.getImages()
      }
    })
    this.route.queryParams.subscribe({
      next: params => params['tab'] && this.selectTab(params['tab'])
    })
  }

  onTabActivated(tab: TabDirective) {
    this.activeTab = tab
    if (this.activeTab.heading === 'Messages' && this.user)
      this.messageService.createHubConnection(this.user, this.member.userName)
    else
      this.messageService.stopHubConnection()
  }
  selectTab(tabHeading: string) {
    if (!this.memberTabs) return
    const tab = this.memberTabs.tabs.find(tab => tab.heading === tabHeading)
    if (!tab) return
    tab.active = true
  }
  loadMessages() {
    if (!this.member) return
    this.messageService.getMessagesThread(this.member.userName).subscribe({
      next: response => this.messages = response
    })
  }

  // loadMember() {
  //   const username = this.route.snapshot.paramMap.get('username')
  //   if (!username) return
  //   this.memberService.getMember(username).subscribe({
  //     next: user => {
  //       this.member = user
  //       this.getImages()
  //     }
  //   })
  // }
  getImages() {
    if (!this.member) return
    for (const photo of this.member.photos) {
      this.photos.push(new ImageItem({ src: photo.url, thumb: photo.url }))
    }
  }
}
