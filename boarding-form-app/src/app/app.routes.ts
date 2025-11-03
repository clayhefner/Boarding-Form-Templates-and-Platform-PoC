import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { BoardingFormTemplatesComponent } from './pages/boarding-form-templates/boarding-form-templates.component';
import { TemplateFormComponent } from './pages/template-form/template-form.component';
import { PlatformComponent } from './pages/platform/platform.component';
import { PlatformEditComponent } from './pages/platform-edit/platform-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'boarding-form-templates', pathMatch: 'full' },
      { path: 'boarding-form-templates', component: BoardingFormTemplatesComponent },
      { path: 'template/add', component: TemplateFormComponent },
      { path: 'template/edit/:id', component: TemplateFormComponent },
      { path: 'platform', component: PlatformComponent },
      { path: 'platform/edit/:id', component: PlatformEditComponent }
    ]
  }
];
