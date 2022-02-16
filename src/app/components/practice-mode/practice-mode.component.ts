import { Component, OnInit } from '@angular/core';
import { AbridgedCategory } from 'src/app/models/abridged-category';
import { Category } from 'src/app/models/category';
import { Question } from 'src/app/models/question';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-practice-mode',
  templateUrl: './practice-mode.component.html',
  styleUrls: ['./practice-mode.component.css']
})
export class PracticeModeComponent implements OnInit {

  categories:AbridgedCategory[] = [];
  currentCategoryName:string = "";
  currentCategoryQuestions:Array<Question[]> = []; //TODO: It probably makes more sense to get all category questions in a category service and inject it into here (could also inject into main game mode)
  displayCategory:string = "";
  currentDifficulty:number= 0;
  currentQuestion:Question = new Question(0, "", "", 0, new Category(0, "", 0, []), "");
  userAnswer:string = "";

  constructor(private questionService:QuestionService) { }

  ngOnInit(): void {
    this.questionService.getMostCategories().subscribe(
      (response:AbridgedCategory[])=> {
        console.log(response);
        this.categories = response;
      }
    )
  }

  difficultyChange():void {
    //when the difficulty changes reset the question that's currently displaying
    this.getCategoryQuestion();
    this.userAnswer = "";
  }

  loadCategoryQuestions():void {
    //any time a new category is selected the currentCategory field will be updated
    //furthermore, the currently displayed question should become null
    this.currentQuestion = new Question(0, "", "", 0, new Category(0, "", 0, []), "");
    this.userAnswer = "";

    //first make sure we didn't re-select the same category
    if (this.currentCategoryName != this.displayCategory) {
      this.questionService.getQuestionsByCategory(this.findCategoryInArray(this.currentCategoryName)).subscribe(
        (response:Category) => {
          //get all of the clues from the category and sory into separate arrays based on difficulty
          let allQuestions:Question[] = response.clues;

          let easiestQuestions:Question[] = [];
          let easyQuestions:Question[] = [];
          let mediumQuestions:Question[] = [];
          let hardQuestions:Question[] = [];
          let hardestQuestions:Question[] = [];

          let easiestValue:number = 100;
          let easyValue:number = 200;
          let mediumValue:number = 300;
          let hardValue:number = 400;
          let hardestValue:number = 500;
          
          for (let i:number = 0; i < allQuestions.length; i++) {
            //point values in jeopardy doubled in the year 2001. Before the increase the values were $100, $200, $300, $400 and $500.
            //After the increase the values went up to $200, $400, $600, $800 and $1000 respectively. The only overlap is with $200 and $400
            //questions. TODO: Add a timestamp to the Question class that will allow us to figure out how difficult $200 and $400 questions are.
            //For now, however, we can just look at the next question in the array to help

            //Verifies that both the question and the value exist
            //Necessary because some clues/questions don't have a question and/or a value
            //Note: I wasn't sure if I should check for empty strings and 0, or if I should check for undefined
            if ((allQuestions[i].question && allQuestions[i].value) || (allQuestions[i].question != "" && allQuestions[i].value != 0)){
              //Update: there are now variables for the values of easiest, easy, medium, hard, and hardest questions
              //If the airdate year is 2001 or later the initial values will be doubled
              //If we decide to implement some kind of functionality similar to double jeopardy, we can just write another conditional
              //and update the values as necessary
              //Side bonus: the use of variable also makes the code a little easier to follow
              if (parseInt(allQuestions[i].airdate.substring(5)) >= 2001){
                easiestValue *= 2;
                easyValue *= 2;
                mediumValue *= 2;
                hardValue *= 2;
                hardestValue *= 2;
              }
              
              switch (allQuestions[i].value) {
                case easiestValue:
                  easiestQuestions.push(allQuestions[i]);
                  break;
                case easyValue:
                  easyQuestions.push(allQuestions[i]);
                  break;
                case mediumValue:
                  mediumQuestions.push(allQuestions[i]);
                  break;
                case hardValue:
                  hardQuestions.push(allQuestions[i]);
                  break;
                case hardestValue:
                  hardestQuestions.push(allQuestions[i]);
                  break;
                //With the changes mentioned above this default case shouldn't happen, but we'll keep it for now
                default:
                  //some of the questions in the API don't have a value assigned so we must skip these
                  console.log("found a question with no value");
              }
            }
          }

          //after going through each question, add the individual question arrays to the currentCategoryQuestions array
          this.currentCategoryQuestions = []; //before adding new questions, make sure to remove any existing questions
          this.currentCategoryQuestions.push(easiestQuestions);
          this.currentCategoryQuestions.push(easyQuestions);
          this.currentCategoryQuestions.push(mediumQuestions);
          this.currentCategoryQuestions.push(hardQuestions);
          this.currentCategoryQuestions.push(hardestQuestions);

          this.displayCategory = this.currentCategoryName;

          //After loading a new category, display a question in the text box
          this.getCategoryQuestion();
        }
      )
    }
  }

  findCategoryInArray(categoryName:string):number {
    //returns the location of the given category in the this.categories array.
    //TODO: I don't like this function, see about making a better way of just storing these values somewhere

    //Idea: query the database in the backend.  Isn't there a table with this information stored?
    //We can create a method in the question service to query the backend
    console.log(categoryName);
    for (let cat of this.categories) {
      if (cat.title == categoryName) return cat.id;
    }

    //if we can't find the category for some reason return a negative number to show an error occured
    return -1;
  }

  getCategoryQuestion():void {
    //look at the length of the question array for the selected difficulty. Generate a random number between 0 and the length
    //of this array - 1 (inclusive) and set that as the current question

    //TODO: Currently all questions are viewable, if we want to limit the questions that can actually get asked during the practice game this would be the
    //place to do it
    let randomNumber:number = Math.floor(Math.random() * this.currentCategoryQuestions[this.currentDifficulty].length)
    this.currentQuestion = this.currentCategoryQuestions[this.currentDifficulty][randomNumber];
    this.userAnswer = ""; //reset whatever answer is currently in the input box
  }

  checkAnswer():void {
    if (this.userAnswer == this.currentQuestion.answer) alert("Correct, good job!");
    else alert("Sorry incorrect, please try again.");
  }

  revealAnswer():void {
    this.userAnswer = this.currentQuestion.answer;
  }

}
