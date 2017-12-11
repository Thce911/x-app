import { Component, OnInit, } from '@angular/core';
import { Course, Group } from '../course';
import { CourseService } from '../course.service';



@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
  
})


export class PublishComponent implements OnInit {

  course: Course;
  group: Group;

  constructor(courseService: CourseService) {
    this.course = courseService.curso;
    this.group = courseService.group;
   }


  ngOnInit() {
    console.log(this.group.elements);

    this.group.elements.forEach(element => {
      
      document.getElementById("container").appendChild(element);
      
      
    });
  }

}
