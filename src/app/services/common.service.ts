import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000, // Adjust duration as needed
      cssClass: 'custom-toast-class', // Apply your custom CSS class
    });
    toast.present();
  }

  async presentLoader(message: string = '') {
    const loading = await this.loadingCtrl.create({
      spinner: 'lines', // Customize as needed (e.g., 'circles', 'crescent')
      backdropDismiss: true,
      mode: 'ios',
    });
    await loading.present();
    return loading; // Optional: return the loading instance for more control
  }

  async dismissLoader() {
    await this.loadingCtrl.dismiss();
  }

  async presentAlert(
    header: string,
    message: string,
    confirmText: string,
    cancelText: string,
    confirmHandler: () => void
  ) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: confirmText,
          handler: confirmHandler,
        },
      ],
    });

    await alert.present();
  }
}
