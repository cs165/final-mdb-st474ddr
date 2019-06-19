class DiaryScreen {
  constructor(containerElement, switchToMain) {
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.storeElements = this.storeElements.bind(this);
    this.enableView = this.enableView.bind(this);
    this.enableEdit = this.enableEdit.bind(this);
    // this.switchToViewClosure= this.switchToViewClosure.bind(this);
    this.switchToViewHandler = this.switchToViewHandler.bind(this);
    this.switchToEditHandler = this.switchToEditHandler.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.homeHandler = this.homeHandler.bind(this);
    this.nextHandler = this.nextHandler.bind(this);
    this.prevHandler = this.prevHandler.bind(this);
    this.getFromID = this.getFromID.bind(this);
    this.getFromDate = this.getFromDate.bind(this);
    this.updateEntry=this.updateEntry.bind(this);
    this.createNewEntry= this.createNewEntry.bind(this);
    this.updateView=this.updateView.bind(this);

    this.switchToMain = switchToMain;
    this.containerElement = containerElement;
    this.storeElements();
    this.editMode = new editMode(this.editElem, this.enableView);
    this.viewMode = new viewMode(this.viewElem, this.enableEdit);
    this.storeDiaryID = false;
    this.storeDate = false;
    this.dateOptions={ month: 'long', day: 'numeric' };

  }
  storeElements() {
    this.homeBtn = document.querySelector("#home-btn");
    this.journalArea = document.querySelector("#journal-area");
    this.editElem = document.querySelector("#editor");
    this.viewElem = document.querySelector("#viewer");
    this.dateElem = document.querySelector("#date");
    this.promptElem = document.querySelector("#prompt");
    this.saveElem = document.querySelector("#save");
    this.prevBtn = document.querySelector("#prev");
    this.nextBtn = document.querySelector("#next");
    this.entryNum= document.querySelector("#entry-num");

  }

  //These are the handlers to toggle between editor and viewer views
  async switchToViewHandler(e) {
    //console.log(e.currentTarget);
//Here is where I will get the post and post it to the db

    //  console.log("classList");
    e.preventDefault();
    e.currentTarget.removeEventListener("blur", this.switchToViewHandler);
    let text = this.editMode.containerElement.value;
    //  console.log(text);
    let result= await this.updateEntry(text);
    this.enableView(text);
    //if (!e.target.classList.contains("editor") && !e.target.classList.contains("viewer")) {}

  }
  // switchToViewClosure(text){
  //   return this.switchToViewHandler;
  // }
  async switchToEditHandler(e) {
    e.preventDefault();
    e.currentTarget.removeEventListener("click", this.switchToEditHandler);
    let result = this.getFromDate();
    //let json= await result.json()
    //let text = this.fetchData("today");

    this.enableEdit(result.text);

  }
  //End of view toggle handlers
  enableView(text) {
    this.editMode.hide(text);
    this.viewMode.show(text);
    this.saveElem.classList.add('inactive');
    this.homeBtn.classList.remove('inactive');
    this.prevBtn.classList.remove('inactive');
    this.nextBtn.classList.remove('inactive');
    this.viewMode.containerElement.addEventListener("click", this.switchToEditHandler);
    //This would be where I would do the posting to db

  }
  enableEdit(text) {
    //this.editMode.containerElement.textContent= text;
    this.editMode.show(text);
    this.viewMode.hide(text);
    this.editMode.containerElement.focus();
    this.saveElem.classList.remove('inactive');
    this.homeBtn.classList.add('inactive');
    this.prevBtn.classList.add('inactive');
    this.nextBtn.classList.add('inactive');
    this.editMode.containerElement.addEventListener("blur", this.switchToViewHandler);

  }
//Need a function that solely updates the views
  //These are the handlers to go home,prev and forwards
  async homeHandler(e) {
    let homeBtn = e.currentTarget;
    //homeBtn.removeEventListener("click", this.homeHandler);
    let today= new Date();
    this.date= Date.parse(today.toLocaleDateString());
    let day = "today";
    let entry = await this.getFromDate();
    if(!entry._id){
      entry= await this.createNewEntry();
    }
    this.updateView(entry);
    this.enableView(entry.text);
    //this.switchToMain();
  }
  async prevHandler(e) {
    let yesterday= new Date();
    let currDay= new Date(this.date);
    yesterday.setDate(currDay.getDate()-1);
    this.date= Date.parse(yesterday.toLocaleDateString());;
    //let day = "prevDay";
    let entry = await this.getFromDate();
    if(!entry._id){
      entry= await this.createNewEntry();
    }
    this.updateView(entry);
    this.enableView(entry.text);
  }
  async nextHandler(e) {
    let tomorrow= new Date();
    let currDay= new Date(this.date);
    //console.log("currDay:", currDay);
    tomorrow.setDate(currDay.getDate()+1);
    this.date= Date.parse(tomorrow.toLocaleDateString());;
    //let day = "nextDay";
    let entry =await  this.getFromDate();
    if(!entry._id){
      entry= await this.createNewEntry();
    }
    this.updateView(entry);
    this.enableView(entry.text);
  }
  updateView(entry){
    let date = new Date(entry.date);
    let prompt = entry.prompt;
    this.promptElem.textContent= prompt;
    this.entryNum.textContent= "Entry ID: "+entry._id;
    this.dateElem.textContent=date.toLocaleDateString('en-US', this.dateOptions);
    //window.location.href="/id/"+entry._id;
  }

  fetchData(day) {
    //let text = apiData[day].text;
    //return text;
  }
  async show(entryID, diaryID, isNewJournal) {

    this.containerElement.classList.remove('inactive');
    this.homeBtn.addEventListener("click", this.homeHandler);
    this.nextBtn.addEventListener("click", this.nextHandler);
    this.prevBtn.addEventListener("click", this.prevHandler);
    if (isNewJournal) {
      this.diaryID = diaryID;
      this.storeDiaryID = true;
      //figure out how to use date object and store the date for later use
      this.storeDate = true;
      let date=new Date();
      //might need to check the date things here if thre are errors
      this.date=Date.parse(date.toLocaleDateString());
      //Will need to create first entry for the current date here

    }
    let entry;
    if (entryID) {
      entry = await this.getFromID(entryID);

      if (!entry._id) {
        //This means it's an invalid id
      }
    } else {
      let resultID = await this.createNewEntry();
      entry = await this.getFromID(resultID._id);

    }


    //let text = this.fetchData("today");
    this.updateView(entry);
    this.enableView(entry.text);
    //this.editMode.containerElement.textContent= text;
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }
  //Fetch Stuff
  //This is based off assumption
  //Setters
  async createNewEntry() {
    //will generate random prompts
    //will create the data object to create the new entry.
    //will post it to the db
    //let date= new Date(); //will need to figure out this date thing and where i source it from. probs create date obj here
    let prompt = prompts[Math.floor(Math.random() * prompts.length)]
    let newEntry = {
      prompt: prompt,
      date: this.date ,
      diaryID :this.diaryID,
      text: ""
    }
    let fetchOptions = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEntry)
    }
    let result = await fetch("/edit-entry", fetchOptions);
    let json= await result.json();
    let id= json._id;
    //id= result._id;
    //console.log("createNewEntry: ",json);
    return json;
  }

  async updateEntry(text) {

    let fetchOptionsGet = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }

    };
    let oldEntryResult = await fetch("/date/"+this.date+"/"+this.diaryID, fetchOptionsGet);
    let oldEntry = await oldEntryResult.json();
    //console.log("oldEntry:", oldEntry);
    let newEntry = oldEntry;
    newEntry.text = text;
    //Should comment out next line to see whether the parsing has an effect
    //console.log("oldEntry.date:",oldEntry.date);
    newEntry.date= Date.parse(oldEntry.date);
    //console.log("newEntry.date:",newEntry.date);

    let fetchOptionsPost = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEntry)
    };
    let result= await fetch("/edit-entry", fetchOptionsPost);
    let json= await result.json();
    //console.log("updateEntry:", json);
    return json;

  }
  //Getters
  async getFromID(entryID) {
    let fetchOptions = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    let result = await fetch("/id-search/" + entryID, fetchOptions);
    let json= await result.json();
    //console.log("getFromID:", json);
    //When I fetch the actuall id, do I do ._id or .id
    if (!this.storeDiaryID && json._id) {
      this.storeDiaryID = true;
      this.storeDate = true;
      this.diaryID = json.diaryID;
      this.date = Date.parse(json.date);
    }
    return json;
  }
  //This is needed to use the next and prev handlers
  async getFromDate() {

    let fetchOptions = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    let result = await fetch("/date/"+this.date+"/"+this.diaryID, fetchOptions);
    let json= await result.json();
    //console.log("getFromDate:", json);
    return json;
  }
}

/*
const urlPathString = window.location.pathname;
    const parts = urlPathString.split('/');
    if (parts.length > 1 && parts[1].length > 0) {
      const word = parts[1];
      this._showWordView(word);
    } else {
      this._showSearchView();
    }
*/
//I will need the date and diary field to get and set from the curr date stored in this instance.
