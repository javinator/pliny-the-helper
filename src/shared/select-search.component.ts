import {Component, input, model, output, ViewChild, ChangeDetectionStrategy} from "@angular/core";
import {
  IonButton,
  IonButtons, IonContent,
  IonHeader,
  IonIcon,
  IonInput, IonItem, IonLabel,
  IonModal,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {deepClone} from "utils";

export interface SelectSearchItem {
  name: string,
  additionalInfo?: string,
  description?: string
}

@Component({
  selector: 'select-search',
  templateUrl: 'select-search.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, IonInput, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonLabel, IonSearchbar, IonContent, IonItem]
})
export class SelectSearchComponent {
  items = input<SelectSearchItem[]>([]);
  label = input.required<string>();
  placeholder = input<string>('Select');
  selectedItem = model<string>();
  selectChanged = output<string>();

  @ViewChild('search') searchbar: IonSearchbar | undefined;

  isModalOpen = false;
  allItems?: SelectSearchItem[];
  filteredItems?: SelectSearchItem[];

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredItems = this.allItems?.filter(d => d.name.toLowerCase().includes(query));
  }

  setModalOpen(val: boolean) {
    this.allItems = deepClone(this.items());
    this.filteredItems = deepClone(this.items());
    this.isModalOpen = val;
    setTimeout(() => {
      this.searchbar?.setFocus();
    }, 250);
  }

  select(value: string) {
    this.selectedItem.set(value);
    this.selectChanged.emit(value);
    this.isModalOpen = false;
  }
}
