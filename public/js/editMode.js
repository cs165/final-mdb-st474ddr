class editMode {
  constructor(containerElement, switchToDiary) {
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.containerElement = containerElement;
  }
  show(text) {
    this.containerElement.textContent= text;
    this.containerElement.classList.remove('inactive');
    //this.createJournalBtn.addEventListener("click", this.createJournal);
  }
  hide(text) {
    //this.containerElement.textContent= text;
    this.containerElement.value= text;
    this.containerElement.classList.add('inactive');
  }
}
