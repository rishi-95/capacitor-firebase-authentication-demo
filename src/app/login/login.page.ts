import { Component, OnInit } from '@angular/core';
import {
  FirebaseAuthentication,
  PhoneCodeSentEvent,
} from '@capacitor-firebase/authentication';
import { CommonService } from '../services/common.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  phoneNumber: string = '';
  verificationOtp: string = '';
  verificationId = '';

  constructor(
    private commonService: CommonService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  signInWithPhoneNumber = async () => {
    return new Promise(async (resolve) => {
      // Attach `phoneCodeSent` listener to be notified as soon as the SMS is sent
      await FirebaseAuthentication.addListener(
        'phoneCodeSent',
        async (event) => {
          // Ask the user for the SMS code
          this.verificationId = event.verificationId;
          this.commonService.presentToast(
            'Please enter the verification code that was sent to your mobile device.'
          );
          await this.commonService.dismissLoader();
        }
      );

      await FirebaseAuthentication.addListener(
        'phoneVerificationFailed',
        async (event) => {
          this.commonService.presentToast(
            'Something went wrong please try again later.'
          );
          await this.commonService.dismissLoader();
        }
      );

      await this.commonService.presentLoader();
      // Start sign in with phone number and send the SMS
      await FirebaseAuthentication.signInWithPhoneNumber({
        phoneNumber: this.phoneNumber,
      }).catch(async (err) => {
          await this.commonService.dismissLoader();
        });
    });
  };

  async loginWithCredential() {
    await this.commonService.presentLoader();

    await FirebaseAuthentication.confirmVerificationCode({
      verificationId: this.verificationId,
      verificationCode: this.verificationOtp.toString(),
    })
      .then(async (data) => {
        await this.commonService.dismissLoader();
        this.navCtrl.navigateRoot('/home', { queryParams: data });
      })
      .catch(async (err) => {
        this.commonService.presentToast(
          'Something went wrong please try again later.'
        );
        await this.commonService.dismissLoader();
      });
  }

  getLoginDisabled() {
    if (this.verificationId) {
      return this.verificationOtp ? this.verificationOtp.toString().length < 6 : true;
    }
    return this.phoneNumber && !(/^\+\d\d{9,}$/.test(this.phoneNumber));
  }

  login() {
    if (!this.verificationId) {
      this.signInWithPhoneNumber();
    } else {
      this.loginWithCredential();
    }
  }
}
