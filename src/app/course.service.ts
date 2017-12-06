import { Injectable } from '@angular/core';
import { Course } from './course';

@Injectable()
export class CourseService {

public curso: Course = new Course('', '', '');

  constructor() { }
}
