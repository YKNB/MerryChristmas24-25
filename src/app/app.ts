import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Christmas } from './christmas/christmas';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Christmas],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('merrychristmas');
}
