import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-christmas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './christmas.html',
  styleUrls: ['./christmas.scss'],
})
export class Christmas implements OnInit, OnDestroy {
  name = '';
  submitted = false;
  theme: 'day' | 'night' = 'night';
  loading = true;
  nameError = '';

  snowBoost = false;
  flashOn = false;

  private snowBoostTimer: any;
  private flashTimer: any;
  private loaderTimer: any;
  private loaderHardTimer: any;
  private loaderMinUntil = 0;
  private loaderModelReady = false;
  private hasModelLoadedOnce = false;

  @ViewChild('whoosh') whoosh?: ElementRef<HTMLAudioElement>;

  ngOnInit() {
    this.showLoader(700, 2500);
  }

  ngOnDestroy() {
    clearTimeout(this.snowBoostTimer);
    clearTimeout(this.flashTimer);
    clearTimeout(this.loaderTimer);
    clearTimeout(this.loaderHardTimer);
  }

  submit() {
    this.name = this.name.trim();
    this.nameError = this.validateName(this.name);
    if (this.nameError) return;

    this.showLoader(600, 2000);
    this.submitted = true;

    // ❄️ Boost neige 2s
    this.snowBoost = true;
    clearTimeout(this.snowBoostTimer);
    this.snowBoostTimer = setTimeout(() => (this.snowBoost = false), 2000);

    // ⚡ Flash 300ms
    this.flashOn = true;
    clearTimeout(this.flashTimer);
    this.flashTimer = setTimeout(() => (this.flashOn = false), 300);

    // 🔊 Whoosh
    const audio = this.whoosh?.nativeElement;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.35;
      audio.play().catch(() => {
        // certains navigateurs peuvent bloquer si pas considéré comme geste utilisateur
      });
    }
  }

  reset() {
    this.submitted = false;
    this.name = '';
    this.nameError = '';

    this.snowBoost = false;
    this.flashOn = false;
    clearTimeout(this.snowBoostTimer);
    clearTimeout(this.flashTimer);
    clearTimeout(this.loaderTimer);
    clearTimeout(this.loaderHardTimer);

    const audio = this.whoosh?.nativeElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  get isFunSanta(): boolean {
    return this.submitted && this.name.length > 6;
  }

  setTheme(mode: 'day' | 'night') {
    this.theme = mode;
  }

  toggleTheme() {
    this.theme = this.theme === 'day' ? 'night' : 'day';
  }

  onModelLoaded() {
    this.hasModelLoadedOnce = true;
    this.loaderModelReady = true;
    this.tryHideLoader();
  }

  private showLoader(minDurationMs: number, maxDurationMs: number) {
    this.loading = true;
    this.loaderModelReady = this.hasModelLoadedOnce;
    this.loaderMinUntil = Date.now() + minDurationMs;
    clearTimeout(this.loaderTimer);
    this.loaderTimer = setTimeout(() => this.tryHideLoader(), minDurationMs);
    clearTimeout(this.loaderHardTimer);
    this.loaderHardTimer = setTimeout(() => {
      this.loading = false;
    }, maxDurationMs);
  }

  private tryHideLoader() {
    if (!this.loading) return;
    if (this.loaderModelReady && Date.now() >= this.loaderMinUntil) {
      this.loading = false;
    }
  }

  private validateName(value: string): string {
    if (!value) return 'Entre un prénom ou un nom complet';
    if (value.length < 2) return 'Le prénom ou nom est trop court.';
    if (value.length > 24) return 'Le prénom ou nom est trop long.';
    const invalidChars = /[^\p{L}\s'-]/u;
    if (invalidChars.test(value)) {
      return 'Utilise uniquement des lettres, espaces, tirets ou apostrophes.';
    }
    return '';
  }

}
