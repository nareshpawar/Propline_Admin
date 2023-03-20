import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderShowServiceService {
  headerFlag = new Subject<boolean>();
  menuFlag = new Subject<boolean>();
  AccountDropdownFlag= new Subject<boolean>();
  submitButtonFlag = new Subject<boolean>();
  sidebarFlag = new Subject<boolean>();

  constructor() { }
}
