class App {
  constructor() {
    this._createAppElements = this._createAppElements.bind(this);
    this.switchToDiary = this.switchToDiary.bind(this);
    this.switchToMain = this.switchToMain.bind(this);
    this.decideScreen = this.decideScreen.bind(this);
    this._createAppElements();
    //this.switchToMain();
    this.decideScreen();
  }
  decideScreen() {
    const urlPathString = window.location.pathname;
    //console.log("urlPathString:",urlPathString);
    const parts = urlPathString.split('/');
    //console.log(parts);
    if (parts.length > 2 && parts[2].length > 0) {

      const entryID = parts[2];
      //console.log("decideScreen entryID:",entryID);
      this.switchToDiary(entryID, null, false);
    } else {
      this.switchToMain();
    }
  }
  _createAppElements() {
    const homeElement = document.querySelector("#home");
    this.home = new HomeScreen(homeElement, this.switchToDiary);
    const diaryElement = document.querySelector("#diary");
    this.diary = new DiaryScreen(diaryElement, this.switchToMain);
  }
  switchToDiary(entryID, diaryID, isNewJournal) {
    this.home.hide();
    this.diary.show(entryID, diaryID, isNewJournal);
  }
  switchToMain() {
    ////console.log("switchToHome")
    this.home.show();
    this.diary.hide();
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
