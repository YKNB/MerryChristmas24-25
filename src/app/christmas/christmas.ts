import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
export class Christmas {
  name = '';
  submitted = false;

  submit() {
    this.name = this.name.trim();
    if (!this.name) return;
    this.submitted = true;
  }

  reset() {
    this.submitted = false;
    this.name = '';
  }
}
