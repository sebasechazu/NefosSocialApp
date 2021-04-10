// ------------------------------------------------------------------------------------------------
// SERVICIO HOME
// ------------------------------------------------------------------------------------------------
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'

})
export class HomeService {
  
  private user: User;
  public stats;
  public identity;
  public token;

  // @ts-ignore: this.prop is really assigned before being use
  private userService = new BehaviorSubject<User>(this.user);
  // @ts-ignore: this.prop is really assigned before being use
  private statsService = new BehaviorSubject<any>(this.stats);
  // @ts-ignore: this.prop is really assigned before being use
  private identityService = new BehaviorSubject<any>(this.identity);
  // @ts-ignore: this.prop is really assigned before being use
  private tokenService = new BehaviorSubject<any>(this.token);

  public userSelect = this.userService.asObservable();
  public statsSelect = this.statsService.asObservable();
  public identitySelect = this.identityService.asObservable();
  public tokenSelect = this.tokenService.asObservable();

  public selectUser(user: User): void {
    this.userService.next(user);
  }
  public selectStats(stats: any): void {
    this.statsService.next(stats);
  }
  public selectIdentity(identity: any): void {
    this.identityService.next(identity);
  }
  public selectToken(token: any): void {
    this.tokenService.next(token);
    
  }

  
}
