import { Component, OnInit } from '@angular/core';
import { Course } from '../course';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public course: Course;


  newCourse() {
    this.course = new Course(0, '', '', '');
  }

  onSubmit() {
    console.log('submitted');
  }

}
