import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable()
export class ProfileService {

    
    private user: User;
    private stats;
    // @ts-ignore: this.prop is really assigned before being use
    private userService = new BehaviorSubject<User>(this.user);
    // @ts-ignore: this.prop is really assigned before being use
    private statsService = new BehaviorSubject<any>(this.stats);

    public userSelect = this.userService.asObservable();
    public statsSelect = this.statsService.asObservable();

    public selectUser(user: User): void {
        this.userService.next(user);
    }
    public selectStats(stats: any): void {
        this.statsService.next(stats);
    }
    

}
