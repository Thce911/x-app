import { Component, OnInit } from '@angular/core';
import { Course, Pendejada } from '../course';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {

  course: Course;
  pendejada: Pendejada;

  constructor(courseService: CourseService) {
    this.course = courseService.curso;
    this.pendejada = courseService.pendejada;
   }


  ngOnInit() {
    console.log(this.pendejada.elements);
    this.pendejada.elements.forEach(element => {
      document.body.appendChild(element);
    });
  }

}
