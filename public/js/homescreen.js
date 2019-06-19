class HomeScreen{
  constructor(containerElement, switchToDiary){
    this.show= this.show.bind(this);
    this.hide= this.hide.bind(this);
    this.createJournal= this.createJournal.bind(this);
    this.switchToDiary= switchToDiary;
    this.containerElement= containerElement;
    this.createJournalBtn = document.querySelector("#create-journal-btn");

  }
  async createJournal(e){
    e.preventDefault();
    let btn = e.currentTarget;
    //btn.removeEventListener("click", this.createJournal);
    let fetchOptions={
      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    let result= await fetch("/create-journal", fetchOptions);
    let json= await result.json();
    this.diaryID=json.diaryID;
    //Will need to add the id for the newly created journal when I call switchToDiary
    ////console.log("createJournalHS:", json);
    this.switchToDiary(null,this.diaryID, true);

  }
  show(){
    this.containerElement.classList.remove('inactive');
    this.createJournalBtn.addEventListener("click", this.createJournal);
  }
  hide() {
    this.containerElement.classList.add('inactive');
  }
}
