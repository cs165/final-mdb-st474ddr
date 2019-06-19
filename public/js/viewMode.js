class viewMode {
  constructor(containerElement, switchToDiary) {
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.containerElement = containerElement;
  }
  show(text) {
    this.containerElement.classList.remove('inactive');
    this.containerElement.textContent= text;
    //this.createJournalBtn.addEventListener("click", this.createJournal);
  }
  hide(text) {
    this.containerElement.textContent= text;
    this.containerElement.classList.add('inactive');
  }
}
