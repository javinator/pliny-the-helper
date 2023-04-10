import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";
import {Storage} from "@ionic/storage-angular";
import {StorageService} from "./services/storage.service";
import {XmlReaderService} from "./services/xml-reader.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, NgForOf, HttpClientModule],
  providers: [Storage, StorageService, HttpClient, XmlReaderService]
})
export class AppComponent implements OnInit {
  constructor(private xmlReader: XmlReaderService) {
  }

  ngOnInit() {
    this.xmlReader.initStyles();
  }

  pages = [
    {
      title: 'Recipes',
      path: '/recipes',
      icon: 'beer'
    },
    {
      title: 'Styles',
      path: '/styles',
      icon: 'easel'
    },
    {
      title: 'Ingredients',
      path: '/styles',
      icon: 'flask'
    },
    {
      title: 'Calculators',
      path: '/styles',
      icon: 'calculator'
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: 'settings'
    }
  ]
}
