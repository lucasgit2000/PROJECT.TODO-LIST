import { Component } from '@angular/core';
import { faArrowRight, faArrowLeft, faCheckSquare, faListAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'my-app';
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faListAlt = faListAlt;
  faCheckSquare = faCheckSquare;
}
