import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class AirbnbNodeService {

  constructor(private http: HttpClient) { }
  baseUrl = "http://localhost:3000";
  public userEmail: any;
  public userName: any;
  public userId: any;
  isEditClickedForProfile: boolean = false;
  isAccountAddClicked: boolean = false;
  accountsSectionClicked: boolean = false;
  public isLoginSuccessful: boolean = false;
  isGuest: boolean = false;
  isHost: boolean = false;
  isAdmin: boolean = false;
  phoneNumber: any;
  RoleSelected: any;
  userType: any;

  checkIsVisible() {
    return !this.isEditClickedForProfile && !this.isAccountAddClicked && !this.accountsSectionClicked;
  }

  getRolesMasterData(): Observable<any> {
    const url = this.baseUrl + '/api/roles';
    return this.http.get(url);
  }

  getStatusMasterData(): Observable<any> {
    const url = this.baseUrl + '/api/statuses';
    return this.http.get(url);
  }

  insertNewUser(data: any): Observable<any> {
    const url = this.baseUrl + '/api/addUser';
    return this.http.post(url, data);
  }

  getUserDetails(email: any): Observable<any> {
    const url = this.baseUrl + '/api/users/?emailid=' + email;
    return this.http.get(url);
  }

  searchStays(searchForm: any): Observable<any> {
    const url = this.baseUrl + '/api/stays/search';
    return this.http.post(url, searchForm);
  }

  getStayDetailsById(id: any): Observable<any> {
    const url = this.baseUrl + '/api/stays/?id=' + id;
    return this.http.get(url);
  }

  getStaysByEmail(id: any): Observable<any> {
    const url = this.baseUrl + '/api/get/stays/?id=' + id;
    return this.http.get(url);
  }

  getStaysByEmailForGuest(id: any): Observable<any> {
    const url = this.baseUrl + '/api/get/staysReserved/?id=' + id;
    return this.http.get(url);
  }


  getAllStays(): Observable<any> {
    const url = this.baseUrl + '/api/allstays';
    return this.http.get(url);
  }

  updateStayStatus(req: any): Observable<any> {
    const url = this.baseUrl + '/api/update/Status';
    return this.http.post(url, req);
  }

  getAmenities(): Observable<any> {
    const url = this.baseUrl + '/api/get/amenties';
    return this.http.get(url);
  }

  getRoomTypes(): Observable<any> {
    const url = this.baseUrl + '/api/romTypes';
    return this.http.get(url);
  }

  addStay(req: any): Observable<any> {
    const url = this.baseUrl + '/api/addStay';
    return this.http.post(url, req);
  }

  updateProfile(req: any): Observable<any> {
    const url = this.baseUrl + '/api/update/profile';
    return this.http.post(url, req);
  }


  deleteStay(id: any): Observable<any> {
    const url = this.baseUrl + '/api/delete/airbnb/?id=' + id;
    return this.http.delete(url);
  }

  addAccount(req: any): Observable<any> {
    const url = this.baseUrl + '/api/addAccount';
    return this.http.post(url, req);
  }

  getAccountsByUserId(userId: any): Observable<any> {
    const url = this.baseUrl + '/api/get/accounts/?id=' + userId;
    return this.http.get(url);
  }

  getAllAccounts(): Observable<any> {
    const url = this.baseUrl + '/api/accounts';
    return this.http.get(url);
  }

  deleteProfile(body: any): Observable<any> {
    const url = this.baseUrl + '/api/users/delete/?id=' + body.id + '&&collectionName=' + body.role;
    return this.http.delete(url);
  }

  bookingConfirmation(body: any): Observable<any> {
    const url = this.baseUrl + '/api/booking';
    return this.http.post(url, body);
  }

  updateAccountDetails(body: any): Observable<any> {
    const url = this.baseUrl + '/api/update/accounts';
    return this.http.post(url, body);
  }

  getUserDetailsByUserId(id: any, collectionName: any): Observable<any> {
    const url = this.baseUrl + '/api/userById/?id=' + id + '&collectionName=' + collectionName;
    return this.http.get(url);
  }

  getAllUsers(collectionName: any): Observable<any> {
    const url = this.baseUrl + '/api/allUsers/?collectionName=' + collectionName;
    return this.http.get(url);
  }

  updatePaymentDetails(req: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/api/paymentDetails', req);
  }

  deleteAccount(id: any): Observable<any> {
    const url = this.baseUrl + '/api/delete/accounts/?id=' + id;
    return this.http.delete(url);
  }

  updatePassword(req: any): Observable<any> {
    const url = this.baseUrl + '/api/update/resetPassword';
    return this.http.post(url, req);
  }
}

