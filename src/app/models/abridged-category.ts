export class AbridgedCategory {

    clues_count:number;
    id:number;
    title:string;

    constructor(id:number, title:string, clues_count:number){
        this.clues_count = clues_count;
        this.id = id;
        this.title = title;
    }

    setId(id:number) : void {
        this.id = id; 
    }

    getId() : number {
        return this.id; 
    }

    setTitle(title:string) : void {
        this.title = title; 
    }

    getTitle() : string {
        return this.title; 
    }
}
