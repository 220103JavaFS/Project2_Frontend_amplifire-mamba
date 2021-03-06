import { Injectable } from '@angular/core';
import { AbridgedCategory } from '../models/abridged-category';
import { Category } from '../models/category';
import { HighScore } from '../models/high-score';
import { Question } from '../models/question';
import { CategoryService } from './category.service';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentGameService {

  categories:AbridgedCategory[] = [];
  questions:Question[][] = [[], [], [], [], [], []];
  currentPoints:number = 0;
  highScoreTracker:HighScore = new HighScore(0, "", 0);

  constructor(private categoryService:CategoryService, private currentUserService:CurrentUserService) {}

  newGame():void {
    //clear out the current category and questions arrays
    this.categories = [];
    this.questions = [[], [], [], [], [], []];
    this.currentPoints = 0;
    this.highScoreTracker = new HighScore(0, "", 0);

    //set the start time for the game
    let startTime = new Date();
    this.highScoreTracker.gameTime = this.highScoreTracker.convertDateToString(startTime); //use helper function in class for formatting
    console.log(this.highScoreTracker);

    //when a new game is started we select 5 random categories, and then select 5 random questions from within that category
    //(although the questions must by of difficulty 100 - 500)
    this.categoryService.getMostCategories().subscribe(
      (response:AbridgedCategory[]) => {
        let randoms:number[] = []
        let count:number = 0;
        while (count < 6) {
          let randomNumber:number = Math.floor(Math.random() * response.length);
          if (!randoms.includes(randomNumber)) {
            count++;
            randoms.push(randomNumber);
            this.categories.push(response[randomNumber]);
          }
        }

        //console.log("categories are set:")
        //console.log(this.categories);
        //attempt to subscribe to question getting function inside of category getting function
        for (let i:number = 0; i < 6; i++) {
          this.categoryService.getQuestionsByCategory(this.categories[i].id).subscribe(
            (response:Category) => {
              console.log(response);
              let randomNumber:number = 0;
              let catYear:number = 0;
              while (true) {
                randomNumber = Math.floor(Math.random() * response.clues.length); //clue length is always divisible by 5
                catYear = parseInt(response.clues[randomNumber].airdate.substring(0, 4));
                //console.log(catYear);

                //we need our chain of clues to start at the lowest possible value
                if (response.clues[randomNumber].value == 100 || (response.clues[randomNumber].value == 200 && catYear > 2001)) break;
              }

              let newQuestions:Question[] = [];

              for (let j:number = randomNumber; j < randomNumber + 5; j++) {
                newQuestions.push(response.clues[j]);
              }
              this.questions[i] = newQuestions;
              //console.log(this.questions);
            }
          )
        }
      }
    )
  }

  endGame():void {
    //when the game is over we need to append the current high score to the current user's high score to make sure it gets saved
    this.highScoreTracker.score = this.currentPoints;
    console.log(this.highScoreTracker);
    console.log(this.currentUserService.currentUser);
    this.currentUserService.addHighScore(this.highScoreTracker);
  }
}
