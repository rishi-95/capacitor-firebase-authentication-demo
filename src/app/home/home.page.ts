import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseAuthentication, GetCurrentUserResult } from '@capacitor-firebase/authentication';
import { CommonService } from '../services/common.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userInfo: GetCurrentUserResult = { user: null };

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: GetCurrentUserResult) => {
      this.userInfo = params;
    });
  }

  async signOut() {
    await this.commonService.presentAlert(
      'Sign Out',
      'Are you sure you want to sign out?',
      'Yes',
      'Cancel',
      async () => {
        await FirebaseAuthentication.signOut();
        this.navCtrl.navigateRoot('/login');
      }
    );
  }
}
