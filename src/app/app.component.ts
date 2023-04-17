import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";
import {Storage} from "@ionic/storage-angular";
import {StorageService} from "./services/storage.service";
import {XmlReaderService} from "./services/xml-reader.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CONFIG} from "./constants";
import {XmlWriterService} from "./services/xml-writer.service";

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
