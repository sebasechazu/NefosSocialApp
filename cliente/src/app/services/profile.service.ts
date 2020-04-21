import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable()
export class ProfileService {

    private user: User;
    private stats;

    private userService = new BehaviorSubject<User>(this.user);
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
