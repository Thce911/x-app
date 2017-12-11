import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';

import { SortablejsOptiosasda } from 'editable';

import { Course, Group } from '../course';
import { CourseService } from '../course.service';
import { SortablejsService } from 'angular-sortablejs/dist/src/sortablejs.service';
import { stringify } from 'querystring';



@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.css'],
  
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
  group: Group;

  constructor(private router: Router, courseService: CourseService) {
    this.course = courseService.curso;
    this.group = courseService.group;
   }

  ngOnInit() {
  }

  toPublish() {
    var ayy = document.querySelectorAll(".contenedor");
    for (const lmao of <any>ayy) {
      var x = lmao.querySelectorAll('div');
      for (const y of x) {
        this.group.elements.push(y);
      }
    }
    console.log(this.group.elements);
   this.router.navigateByUrl('/publish', {skipLocationChange: true});
  }
}
