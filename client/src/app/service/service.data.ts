import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	public blogId: any;
	public blogInfo: any;
	public userInfo: any;

	private userInfoSubject = new BehaviorSubject<any>('');
	userInfo$ = this.userInfoSubject.asObservable();

	setUserInfo = (value: any) => {
		this.userInfoSubject.next(value);
	}

	getUserInfo = () : any => {
		return this.userInfoSubject.getValue();
	}
}