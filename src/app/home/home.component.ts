import { Component } from '@angular/core';
import { Course } from '../course';
import { Router } from '@angular/router';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public course: Course;
  constructor(private router: Router, private courseService: CourseService) {
    this.course = courseService.curso;
   }

  onSubmit() {
    this.router.navigateByUrl('/creator', {skipLocationChange: true});
    console.log('submitted');
    console.log(this.courseService.curso);
  }

}
