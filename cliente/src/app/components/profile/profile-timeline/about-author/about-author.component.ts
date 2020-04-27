// ------------------------------------------------------------------------------------------------
// componente
import { Component, OnInit, Input } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { User } from '../../../../models/user';
// ------------------------------------------------------------------------------------------------
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-about-author',
  templateUrl: './about-author.component.html'

})
export class AboutAuthorComponent implements OnInit {

  public user: User;
  public stats;

  constructor(
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.profileService.userSelect.subscribe(us => this.user = us);
    this.profileService.statsSelect.subscribe(st => this.stats = st);
  }
}
