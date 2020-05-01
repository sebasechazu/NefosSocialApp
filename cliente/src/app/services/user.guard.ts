import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate {

    constructor(
        private router: Router,
        private userService: UserService

    ) { }

    canActivate() {
        const identity = this.userService.getIdentity();

        if (identity && (identity === 'ROLE_USER' || 'ROLE_ADMIN')) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }

}
