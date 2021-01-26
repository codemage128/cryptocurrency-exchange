import { Role } from './role';
import { User } from './user';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogin = false;
  roleAs: string;

  users: User[] = [
    {
      id: 1,
      img: 'assets/images/user/admin.jpg',
      username: 'admin',
      password: 'admin',
      firstName: 'Sarah',
      lastName: 'Smith',
      role: Role.Admin,
    },
    {
      id: 2,
      img: 'assets/images/user/doctor.jpg',
      username: 'doctor',
      password: 'doctor',
      firstName: 'Ashton',
      lastName: 'Cox',
      role: Role.Doctor,
    },
    {
      id: 3,
      img: 'assets/images/user/patient.jpg',
      username: 'patient',
      password: 'patient',
      firstName: 'Cara',
      lastName: 'Stevens',
      role: Role.Patient,
    },
  ];

  constructor() {}

  login(uname: string, pwd: string) {
    const user = this.users.find(
      (x) => x.username === uname && x.password === pwd
    );

    if (user) {
      this.roleAs = user.role;
      localStorage.setItem('STATE', 'true');
      localStorage.setItem('ROLE', user.role);
      localStorage.setItem('USERIMG', user.img);
      localStorage.setItem('FULLNAME', user.firstName + ' ' + user.lastName);
      this.isLogin = true;
    } else {
      this.roleAs = '';
      this.isLogin = false;
      localStorage.setItem('STATE', 'false');
    }
    return of({ success: this.isLogin, role: this.roleAs });
  }

  logout() {
    this.isLogin = false;
    this.roleAs = '';
    localStorage.setItem('STATE', 'false');
    localStorage.setItem('ROLE', '');
    localStorage.setItem('FULLNAME', '');
    localStorage.setItem('USERIMG', '');
    return of({ success: this.isLogin, role: '' });
  }

  isLoggedIn() {
    const loggedIn = localStorage.getItem('STATE');
    if (loggedIn === 'true') {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    return this.isLogin;
  }

  getRole() {
    return localStorage.getItem('ROLE');
  }
  getUserFullName() {
    return localStorage.getItem('FULLNAME');
  }
  getUserImg() {
    return localStorage.getItem('USERIMG');
  }
}
