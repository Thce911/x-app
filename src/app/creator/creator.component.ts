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
    group: {
      name: 'shared',
      put: function (to) {
        return to.el.children.length < 2;
      }
    },
    animation: 100
  };
  optionsB: SortablejsOptions = {
    animation: 100,
    sort: false,
    group: {
      name: 'shared',
      pull: 'clone',
      revertClone: true,
    },
    onAdd: function (evt) {
      evt.item.parentNode.removeChild(evt.item);
    }
  };

course: Course;
  constructor(courseService: CourseService) {
    this.course = courseService.curso;
   }



  ngOnInit() {
  }

}
