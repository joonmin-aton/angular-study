import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // 아이템 설정
  setItem(key: string, value: any): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('localStorage setItem error:', error);
      }
    }
  }

  // 아이템 가져오기
  getItem<T>(key: string): T | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('localStorage getItem error:', error);
        return null;
      }
    }
    return null;
  }

  // 아이템 삭제
  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('localStorage removeItem error:', error);
      }
    }
  }

  // 모든 아이템 삭제
  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('localStorage clear error:', error);
      }
    }
  }

  // 키 존재 확인
  hasItem(key: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key) !== null;
    }
    return false;
  }

  // 모든 키 가져오기
  getAllKeys(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      return Object.keys(localStorage);
    }
    return [];
  }

  // localStorage 사용 가능 여부 확인
  isAvailable(): boolean {
    return isPlatformBrowser(this.platformId) && typeof Storage !== 'undefined';
  }
}