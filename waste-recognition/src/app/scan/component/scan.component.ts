import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonButton,
  IonContent,
  Platform,
  IonSpinner,
} from '@ionic/angular/standalone';
import { catchError, EMPTY, from, switchMap } from 'rxjs';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

@Component({
  selector: 'app-onboarding',
  templateUrl: './scan.component.html',
  imports: [IonContent, IonButton, HttpClientModule, IonSpinner],
  providers: [HTTP],
  styleUrl: './styles/scan.component.scss',
})
export class ScanComponent {
  public loading: WritableSignal<boolean> = signal(false);
  private _imageUrl?: string = '';
  private _httpClient: HttpClient = inject(HttpClient);
  private _router: Router = inject(Router);
  private nativeHttp: HTTP = inject(HTTP);
  private platform: Platform = inject(Platform);

  openCamera() {
    this.loading.set(true);

    from(
      Camera.getPhoto({
        quality: 90,
        width: 400,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      })
    )
      .pipe(
        switchMap((photo) => {
          this._imageUrl = photo.webPath;
          return this.uploadImage(photo);
        }),
        catchError((err) => {
          console.error(err);
          this._router.navigate(['/error']);
          return EMPTY;
        })
      )
      .subscribe((response: any) => {
        console.log(response);
        let result: any;

        if (response.data) {
          result = JSON.parse(response.data);
        } else {
          result = response;
        }
        this.loading.set(false);
        this._router.navigate(['/success'], {
          queryParams: {
            class: result.class,
          },
        });
      });
  }

  uploadImage(photo: any) {
    const filePath = photo.path || photo.webPath; // берем путь к файлу

    if (!filePath) {
      console.error('No file path found in photo object');
      return EMPTY;
    }

    if (this.platform.is('capacitor') || this.platform.is('cordova')) {
      return from(
        this.nativeHttp.uploadFile(
          'https://waste-api.vstrechya.space/api/v1/wastes/classify/',
          {},
          { 'Content-Type': 'multipart/form-data' },
          filePath,
          'file'
        )
      ).pipe(
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      );
    } else {
      // Браузер: сначала превращаем в FormData
      return from(fetch(photo.webPath!).then((r) => r.blob())).pipe(
        switchMap((imageBlob: Blob) => {
          const formData = new FormData();
          formData.append('file', imageBlob, 'scan-image.jpeg');

          return this._httpClient.post('/api/v1/wastes/classify/', formData);
        }),
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      );
    }
  }
}
