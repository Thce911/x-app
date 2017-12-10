import { Injectable } from '@angular/core';
import { Course, Pendejada } from './course';

@Injectable()
export class CourseService {

public curso: Course = new Course('', '', '');

public pendejada: Pendejada = new Pendejada([]);

  constructor() { }
}
