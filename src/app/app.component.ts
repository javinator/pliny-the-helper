import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";
import {Storage} from "@ionic/storage-angular";
import {StorageService, XmlReaderService, XmlWriterService} from "services";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, NgForOf],
  providers: [Storage, StorageService, XmlReaderService, XmlWriterService]
})
export class AppComponent implements OnInit {
  constructor(private xmlReader: XmlReaderService) {
  }

  ngOnInit() {
    this.xmlReader.initStyles();
    this.xmlReader.initFermentables();
    this.xmlReader.initHops();
    this.xmlReader.initYeasts();
    this.xmlReader.initMiscs();
    this.xmlReader.initMashProfiles();
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
  ]
}
