import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { ProjectsComponent } from './projects.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { ProjectService } from '../../services/project/project.service';
import { ProjectCreateComponent } from './project-create/project-create.component';

const projectsRoutes: Routes = [
  {
    path: '',
    component: ProjectsComponent
  },
  {
    path: 'create',
    component: ProjectCreateComponent,
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: ProjectDetailsComponent
  },
  {
    path: ':id/settings',
    component: ProjectSettingsComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(projectsRoutes),
    CommonModule,
    FormsModule,
    SimpleNotificationsModule,
    TranslateModule
  ],
  declarations: [
    ProjectsComponent,
    ProjectDetailsComponent,
    ProjectSettingsComponent,
    ProjectCreateComponent
  ],
  providers: [
    ProjectService
  ]
})
export class ProjectsModule { }
