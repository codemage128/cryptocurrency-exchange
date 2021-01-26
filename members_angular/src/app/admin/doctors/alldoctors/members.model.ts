import { formatDate } from '@angular/common';
export class Members {
  id: number;
  img: string;
  firstName: string;
  lastName: string;
  username: string;
  updatedAt: string;
  tfa_allow: boolean;
  constructor(doctors) {
    {
      this.id = doctors.id || this.getRandomID();
      this.img = doctors.avatar || 'assets/images/user/user1.jpg';
      this.firstName = doctors.firstName || '';
      this.lastName = doctors.lastName || '';
      this.username = doctors.username || '';
      this.updatedAt = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.tfa_allow = doctors.tfa_allow || false;
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
