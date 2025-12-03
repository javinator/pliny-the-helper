import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {IonicModule, IonSearchbar} from "@ionic/angular";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'select-search',
  templateUrl: 'select-search.component.html',
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class SelectSearchComponent {
  @Input()
  items: { name: string, additionalInfo?: string, description?: string }[] = [];

  @Input()
  label!: string;

  @Input()
  placeholder = 'Select';

  @Input()
  selectedItem?: string;

  @Output()
  selectChanged = new EventEmitter<string>();

  @ViewChild('search') searchbar: IonSearchbar | undefined;

  isModalOpen = false;

  filteredItems?: { name: string, additionalInfo?: string, description?: string }[];

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredItems = this.items.filter(d => d.name.toLowerCase().indexOf(query) > -1);
  }

  setModalOpen(val: boolean) {
    this.filteredItems = [...this.items];
    this.isModalOpen = val;
    setTimeout(() => {
      this.searchbar?.setFocus();
    }, 250);
  }

  select(value: string) {
    this.selectedItem = value;
    this.selectChanged.emit(value);
    this.isModalOpen = false;
  }
}
