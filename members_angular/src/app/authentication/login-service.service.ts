import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import  *  as  Config  from  'config.json';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  headerOptions: any = null
  uname: string = ''
  authSub = new Subject<any>();
  baseApi: string = Config.api.baseApi;

  constructor(private _http: HttpClient) {
  }

  setupAuth(uname) {
    return this._http.post(this.baseApi + "/users/tfa/setup/" + uname, {}, { observe: 'response' })
  }

  getAuth(uname) {
    return this._http.get(this.baseApi + "/users/tfa/setup/" + uname, { observe: 'response' });
  }

  deleteAuth() {
    return this._http.delete(this.baseApi + "/users/tfa/setup", { observe: 'response' });
  }

  verifyAuth(token: any) {
    return this._http.post(this.baseApi + "/users/tfa/verify", { token }, { observe: 'response' });
  }
}
