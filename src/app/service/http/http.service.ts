import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  endPoint: String = environment.endPoint // api endpoint url
  constructor(
    private httpClient: HttpClient
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let ok: any;
    request = request.clone({
      headers: request.headers.append('X-RapidAPI-Key', environment.XRapidAPIKey).append('X-RapidAPI-Host', environment.XRapidAPIHost)
    });
    return next.handle(request).pipe(
      tap(  // Succeeds when there is a response; ignore other events
        event => ok = event instanceof HttpResponse ? 'succeeded' : '',
        // Operation failed; error is an HttpErrorResponse
        error => ok = error
      ),
      // log when response observable either completes or errors
      finalize(() => {
        if (ok != "succeeded") {
          this.handleError(ok);
        }
      })
    );
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error && error.error.errors) { // client-side error and server side
      if (Array.isArray(error.error.errors.msg)) { // validation error message
        if (error.error.errors.msg.length) {
          const ob = error.error.errors.msg[0]
          if (ob.msg == "IS_EMPTY") {
            errorMessage = `${ob.param} missing`
          } else {
            errorMessage = ob.msg
          }
        }
      } else {
        errorMessage = error.error.errors.msg;
      }
    } else { 
      errorMessage = error.error.data ? error.error.data : 'Something went wrong';
    }
    return throwError(() => new Error(errorMessage));
  }

  getTeams(): Observable<any> {
    let API_URL = `${this.endPoint}/teams`;
    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
    )
  }

  getGames(query: string): Observable<any> {
    let API_URL = `${this.endPoint}/games?${query}`;
    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
    )
  }

  getSpecificTeam(teamId: number): Observable<any> {
    let API_URL = `${this.endPoint}/teams/${teamId}`;
    return this.httpClient.get(API_URL).pipe(
      map(res => {
        return res
      }),
    )
  }

}
