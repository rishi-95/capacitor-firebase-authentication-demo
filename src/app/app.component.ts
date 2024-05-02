import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { NavController, Platform } from '@ionic/angular';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private commonService: CommonService
  ) {}

  async ngOnInit(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const app = initializeApp(environment.firebaseConfig);
      let auth = initializeAuth(app, {
        persistence: indexedDBLocalPersistence,
      });
      const result = await FirebaseAuthentication.getCurrentUser();
      if (result.user) {
        this.navCtrl.navigateRoot('/home', { queryParams: result });
      }
    } else {
      getAuth();
    }

    this.platform.backButton.subscribeWithPriority(999, async () => {
      await this.commonService.presentAlert(
        'Exit App',
        'Are you sure you want to exit the app?',
        'Yes',
        'Cancel',
        () => {
          navigator['app'].exitApp();
        }
      );
    });
  }
}
