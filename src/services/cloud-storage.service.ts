import {Injectable, inject} from '@angular/core';
import {Recipe} from "models";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {
  private http = inject(HttpClient);

  public getRecipes(email: string, password: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>('https://pliny.bier-freunde.ch/rest/api.php', {
      headers: {
        'Authorization': 'Basic ' + btoa(email + ':' + password)
      }
    });
  }

  public saveRecipes(email: string, password: string, recipes: Recipe[]) {
    return this.http.post('https://pliny.bier-freunde.ch/rest/api.php', recipes, {
      headers: {
        'Authorization': 'Basic ' + btoa(email + ':' + password)
      }
    });
  }
}
