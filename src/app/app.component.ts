import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";
import {Storage} from "@ionic/storage-angular";
import {StorageService, XmlReaderService, XmlWriterService} from "services";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, NgForOf, HttpClientModule],
  providers: [Storage, StorageService, HttpClient, XmlReaderService, XmlWriterService]
})
export class AppComponent implements OnInit {
  constructor(private xmlReader: XmlReaderService, private storage: StorageService) {
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
