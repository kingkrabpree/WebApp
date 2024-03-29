import { Component, OnInit } from '@angular/core'
import { Message } from '../_model/message'
import { Pagination } from '../_model/pagination'
import { MessageService } from '../_services/message.service'
import { faEnvelope, faEnvelopeOpen, faPaperPlane, faTrashCan } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages?: Message[]
  pagination?: Pagination
  label = 'Unread'  // 'Inbox'
  pageNumber = 1
  pageSize = 5
  loading = false
  faEnvelopeOpen = faEnvelopeOpen
  faEnvelope = faEnvelope
  faPaperPlane = faPaperPlane
  faTrashCan = faTrashCan
  constructor(private messageService: MessageService) { }
  ngOnInit(): void {
    this.loadMessage()
  }

  loadMessage() {
    this.loading = true
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.label).subscribe({
      next: response => {
        this.messages = response.result
        this.pagination = response.pagination
        this.loading = false
      }
    })
  }
  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: _ => this.messages?.splice(this.messages.findIndex(ms => ms.id === id), 1)
    })
  }
  pageChanged(event: any) {
    if (this.pageNumber === event.page) return
    this.pageNumber = event.page
    this.loadMessage()
  }
}
