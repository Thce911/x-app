import { Injectable } from '@angular/core';
import { Course, Group } from './course';

@Injectable()
export class CourseService {

public curso: Course = new Course('', '');

public group: Group = new Group([]);

  constructor() { }
}
