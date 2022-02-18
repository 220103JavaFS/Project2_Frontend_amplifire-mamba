import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Question } from '../models/question';

import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[CategoryService]
    });
    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sort questions by difficulty and return a 2d array', () => {
    let questions: Question[] = [{id: 1, question: "haha?", answer: "answer ha", value:200, category: {id: 1, title: "yo", clues_count: 3, clues:[]}, airdate: "2001"},
    {id: 2, question: "haha?", answer: "answer ha", value:400, category: {id: 1, title: "yo", clues_count: 3, clues:[]}, airdate: "2003"},
    {id: 3, question: "haha?", answer: "answer ha", value:600, category: {id: 1, title: "yo", clues_count: 3, clues:[]}, airdate: "2002"}];

    let result: Array<Question[]> = service.sortByDifficulty(questions);
    let count: number = 0;

    for (let x = 0; x < result.length; x++){
      if (result[x][0]){
        count++;
      }
    }
    
    expect(count).toBe(3)
  })
});
