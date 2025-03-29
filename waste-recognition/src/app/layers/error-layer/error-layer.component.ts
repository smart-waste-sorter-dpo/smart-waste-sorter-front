import {} from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonIcon,
  NavController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-error',
  templateUrl: './error-layer.component.html',
  styleUrls: ['./styles/error-layer.component.scss'],
  imports: [IonContent, IonButton],
})
export class ErrorLayerComponent {
  private _navCtrl: NavController = inject(NavController);

  goToScanPage() {
    this._navCtrl.navigateForward('/scan'); // Переход на страницу сканирования
  }
}
