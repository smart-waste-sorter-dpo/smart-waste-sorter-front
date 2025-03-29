import {} from '@angular/common/http';
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonIcon,
  NavController,
} from '@ionic/angular/standalone';
import { WasteTypes } from './data/waste-types.enum';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Classify } from '../scan/interfaces/classify.interface';

@Component({
  selector: 'app-onboarding',
  templateUrl: './success-layer.component.html',
  styleUrl: './styles/success-layer.scss',
  imports: [IonContent, IonButton],
})
export class SuccessLayerComponent implements OnInit {
  public currType: WritableSignal<string> = signal('');
  protected unknownTrash: boolean = false;
  private _navCtrl: NavController = inject(NavController);
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const currType: string =
      this._activatedRoute.snapshot.queryParams?.['class'];
    switch (currType) {
      case WasteTypes.PAPER:
        this.currType.set('бумаги');
        break;
      case WasteTypes.GLASS:
        this.currType.set('стекла');
        break;
      case WasteTypes.CARDBOARD:
        this.currType.set('бумаги');
        break;
      case WasteTypes.METAL:
        this.currType.set('металла');
        break;
      case WasteTypes.BIODEGRADABLE:
        this.currType.set('органических отходов');
        break;
      case WasteTypes.PLASTIC:
        this.currType.set('пластика');
        break;
      case WasteTypes.TRASH:
        this.unknownTrash = true;
        break;
    }
  }

  goToScanPage() {
    this._navCtrl.navigateForward('/scan');
  }
}
