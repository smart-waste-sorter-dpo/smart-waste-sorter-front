import { Component, inject, signal, WritableSignal } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonButton, IonContent } from '@ionic/angular/standalone';
import { OnboardingService } from './services/onboarding.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  imports: [IonContent, IonButton],
  styleUrl: './styles/onboarding.component.scss',
})
export class OnboardingComponent {
  currentSlideIndex: WritableSignal<number> = signal(0);
  private _navCtrl: NavController = inject(NavController);
  private _onboardingService: OnboardingService = inject(OnboardingService);

  slides = [
    {
      icon: 'assets/recycle.png',
      title: 'Сканирование мусора',
      description:
        'Учитесь быстро сканировать мусор для правильной утилизации. Приложение помогает определить тип отходов.',
    },
    {
      icon: 'assets/trash.png',
      title: 'Правильная сортировка',
      description:
        'Разделяйте материалы для переработки, чтобы снизить нагрузку на природу. Приложение распознаёт бумагу, пластик, стекло и другие виды отходов, помогая сортировать их правильно.',
    },
    {
      icon: 'assets/camera.png',
      title: 'Перейти к сканированию',
      description:
        'Готовы начать? Просто наведите камеру на предмет, и приложение подскажет, как его переработать. Внесите вклад в экологию уже сейчас!',
    },
  ];

  onSlideChange(event: any) {
    this.currentSlideIndex = event.realIndex;
  }

  nextSlide() {
    if (this.currentSlideIndex() < this.slides.length - 1) {
      this.currentSlideIndex.set(this.currentSlideIndex() + 1);
    }
  }

  goToScanPage() {
    this._onboardingService.completeOnboarding();
    this._navCtrl.navigateForward('/scan');
  }

  goToSlide(index: number) {
    this.currentSlideIndex.set(index);
  }
}
