import {Injectable, inject} from '@angular/core';
import {Recipe} from "models";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface RecipeResponse {
  recipes: Recipe[],
  timestamp: Date,
}

@Injectable({
  providedIn: 'root'
})
export class CloudStorageService {
  private readonly http = inject(HttpClient);

  public getRecipes(email: string, password: string): Observable<RecipeResponse> {
    return this.http.get<RecipeResponse>('https://pliny.bier-freunde.ch/rest/api.php', {
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

  public getTimestamp(email: string, password: string): Observable<Date> {
    return this.http.get<Date>('https://pliny.bier-freunde.ch/rest/api.php/timestamp', {
      headers: {
        'Authorization': 'Basic ' + btoa(email + ':' + password)
      }
    });
  }
}
