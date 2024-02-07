import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { MemberListComponent } from './members/member-list/member-list.component'
import { MemberDetailComponent } from './members/member-detail/member-detail.component'
import { ListsComponent } from './lists/lists.component'
import { MessagesComponent } from './messages/messages.component'
import { authGuard } from './_guard/auth.guard'
import { TestErrorComponent } from './errors/test-error/test-error.component'
import { NotFoundComponent } from './errors/not-found/not-found.component'
import { ServerErrorComponent } from './errors/server-error/server-error.component'
import { MemberProfileComponent } from './members/member-profile/member-profile.component'
import { preventUnsavedChangesGuard } from './_guard/prevent-unsaved-changes.guard'
import { memberDetailResolver } from './_resolvers/member-detail.resolver'

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '', runGuardsAndResolvers: 'always', canActivate: [authGuard], children: [
      { path: 'members', component: MemberListComponent },
      { path: 'members/:id', component: MemberDetailComponent },
      { path: 'members/name/:username', component: MemberDetailComponent },
      { path: 'member/profile', component: MemberProfileComponent, canDeactivate: [preventUnsavedChangesGuard] },
      { path: 'members/name/:username', component: MemberDetailComponent, resolve: { member: memberDetailResolver } },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
    ]
  },
  { path: 'errors', component: TestErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
