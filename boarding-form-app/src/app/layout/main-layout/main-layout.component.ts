import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { AdminModeService } from '../../services/admin-mode.service';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, RouterModule, NzLayoutModule, NzMenuModule, NzIconModule, NzSwitchModule, FormsModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  isCollapsed = false;
  isAdminMode = false;

  constructor(private adminModeService: AdminModeService) {}

  onRoleToggle(): void {
    this.adminModeService.setAdminMode(this.isAdminMode);
    console.log('Role toggled to:', this.isAdminMode ? 'Admin' : 'User');
  }
}
