import { Component, OnInit, Input } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';

import { Course } from '../course';
import { CourseService } from '../course.service';
import { SortablejsService } from 'angular-sortablejs/dist/src/sortablejs.service';



@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.css']
})
export class CreatorComponent implements OnInit {
  optionsA: SortablejsOptions = {
    group: 'shared',
    animation: 100,
    onAdd: (event: any) => {
      console.log(event.to);
    }
  };
  optionsB: SortablejsOptions = {
    animation: 200,
    sort: false,
    group: {
      name: 'shared',
      pull: 'clone',
      revertClone: true,
      put: false
    }
  };

course: Course;
  constructor(courseService: CourseService) {
    this.course = courseService.curso;
   }



  ngOnInit() {
  }

}
