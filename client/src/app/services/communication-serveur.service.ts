import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Image } from '../../../../common/image';
import { HttpClient } from '@angular/common/http';

const LISTES = "/getListes";
const SAUVEGARDE = "/getListes/sauvegarde";
//const IMAGE = "/getListes/image";
const BDSAUVEGARDE = "/database/sauvegarde";
const BDIMAGES = "/database/images";
const BDSUPRIMMER = "/database/supprimer";
@Injectable({
  providedIn: 'root',
})
export class CommunicationServeurService {
  private readonly BASE_URL: string = 'http://localhost:3000';

  public image = new Subject<Image>();
  public imageString: string;
  constructor(private http: HttpClient) {
   }

  getListes(): Observable<Image[]> {
    return this.http.get<Image[]>(this.BASE_URL + LISTES).pipe(
      catchError(this.handleError<Image[]>('basicGet')),
    );
  }
  getImages(): Observable<Image[]> {
    return this.http.get<Image[]>(this.BASE_URL + BDIMAGES).pipe(
      catchError(this.handleError<Image[]>('basicGet')),
    );
  }
  setNouvelleImage(nouvelleImage: string): Observable<string>{
    let svgImage = this.imageString;
    return this.http.post<string>(this.BASE_URL + SAUVEGARDE, {nouvelleImage: nouvelleImage, svgImage: svgImage});
  }
  setNouvelleImage2(titre: string, etiquettes: string): Observable<string>{
    let svgImage = this.imageString;
    return this.http.post<string>(this.BASE_URL + BDSAUVEGARDE, {titre: titre, svgImage: svgImage, etiquettes: etiquettes});
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
  
  public setImageServeur(id: string): Observable<Image> {
  return this.http.get<Image>(this.BASE_URL + BDIMAGES + "/" + id).pipe(
    catchError(this.handleError<Image>('basicGet')),
    );
  }

  public supprimerImageServeur(id: string): Observable<string> {
    return this.http.delete<string>(this.BASE_URL + BDSUPRIMMER + "/" + id);
  }


  public setImage(id: string) {
    this.setImageServeur(id).subscribe((resultat: Image) =>{
      this.image.next(resultat);
    });
  }

  public setImageCharger(image: Image) {
    this.image.next(image);
  }

  getImage(): Observable<Image> {
    return this.image.asObservable();
  }

  public setEtGetImage(svg: string) {
    this.imageString = svg;
  }

}
