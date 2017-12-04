import { Component, OnInit } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';



@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.css']
})
export class CreatorComponent implements OnInit {

  optionsA: SortablejsOptions = {
    group: 'shared',
    animation: 100
  };
  optionsB: SortablejsOptions = {
    animation: 200,
    sort: false,
    group: {
      name: 'shared',
      pull: 'clone',
      revertClone: true
    }
    
  };


  constructor() { }

  ngOnInit() {
  }

}
