import {Component, inject, OnInit, signal} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from "@angular/router";
import {Storage} from "@ionic/storage-angular";
import {StorageService, XmlReaderService, XmlWriterService} from "services";
import {addIcons} from "ionicons";
import {
  basketOutline,
  beerOutline,
  calculatorOutline,
  easelOutline,
  flaskOutline,
  settingsOutline,
  add,
  folderOpen,
  save,
  cloud,
  trash,
  water,
  eyedrop,
  pencil,
  colorWand,
  arrowBack,
  checkmark,
  hammer,
  warning
} from 'ionicons/icons';
import {Subscription} from "rxjs";
import {Settings} from "models";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink],
  providers: [Storage, StorageService, XmlReaderService, XmlWriterService]
})
export class AppComponent implements OnInit {
  private xmlReader = inject(XmlReaderService);
  private storage = inject(StorageService);
  private sub?: Subscription;

  constructor() {
    addIcons({
      basketOutline,
      beerOutline,
      calculatorOutline,
      easelOutline,
      flaskOutline,
      settingsOutline,
      add,
      folderOpen,
      save,
      cloud,
      trash,
      water,
      eyedrop,
      pencil,
      colorWand,
      arrowBack,
      checkmark,
      hammer,
      warning
    });
  }

  pages = [
    {
      title: 'Recipes',
      path: '/recipes',
      icon: 'beer-outline'
    },
    {
      title: 'Styles',
      path: '/styles',
      icon: 'easel-outline'
    },
    {
      title: 'Ingredients',
      path: '/ingredients',
      icon: 'basket-outline'
    },
    {
      title: 'Water Profiles',
      path: '/waters',
      icon: 'flask-outline'
    },
    {
      title: 'Calculators',
      path: '/calculators',
      icon: 'calculator-outline'
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: 'settings-outline'
    }
  ];

  showWaters = signal(false);

  ngOnInit() {
    this.xmlReader.initStyles();
    this.xmlReader.initFermentables();
    this.xmlReader.initHops();
    this.xmlReader.initYeasts();
    this.xmlReader.initMiscs();
    this.xmlReader.initMashProfiles();
    this.xmlReader.initWaters();
    setTimeout(() => {
      this.storage.get('settings')?.then((settings: Settings) => {
        this.showWaters.set(settings?.useWaterChemistry || false);
      })
    }, 0);
  }

  subscribeToUpdateEmitter(componentRef: any) {
    if (componentRef.updateNavigation != null) {
      this.sub = componentRef.updateNavigation.subscribe(() => {
        this.storage.get('settings')?.then((settings: Settings) => {
          setTimeout(() => this.showWaters.set(settings?.useWaterChemistry || false), 0);
        })
      });
    }
  }

  unsubscribeFromUpdateEmitter(componentRef: any) {
    if (componentRef.updateNavigation != null) {
      this.sub?.unsubscribe()
    }
  }
}
