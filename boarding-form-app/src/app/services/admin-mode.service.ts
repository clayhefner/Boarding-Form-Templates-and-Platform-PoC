import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminModeService {
  private isAdminModeSubject = new BehaviorSubject<boolean>(false);
  public isAdminMode$: Observable<boolean> = this.isAdminModeSubject.asObservable();

  constructor() { }

  setAdminMode(isAdmin: boolean): void {
    this.isAdminModeSubject.next(isAdmin);
  }

  getAdminMode(): boolean {
    return this.isAdminModeSubject.value;
  }
}
