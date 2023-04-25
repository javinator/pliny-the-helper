import {Component, EventEmitter, Input, Output} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'p-select-search',
  templateUrl: 'select-search.component.html',
  standalone: true,
  imports: [IonicModule, FormsModule, NgIf, NgForOf]
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

  isModalOpen = false;


  filteredItems?: { name: string, additionalInfo?: string, description?: string }[];

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredItems = this.items.filter(d => d.name.toLowerCase().indexOf(query) > -1);
  }

  setModalOpen(val: boolean) {
    this.filteredItems = [...this.items];
    this.isModalOpen = val;
  }

  select(value: string) {
    this.selectedItem = value;
    this.selectChanged.emit(value);
    this.isModalOpen = false;
  }
}
