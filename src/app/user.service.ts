import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/'; 
  constructor(private http: HttpClient) {}
  registerUser(
    name: string,
    role: string,
    email: string,
    password: string,
    level?: string
  ): Observable<any> {
    const body = { name, role, email, password, level: level || '' };
    return this.http.post(`${this.apiUrl}register`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'json',
    });
  } 
  loginUser(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}login`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'json',
    });
  }
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}users`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  } 
  getTasksByAssignedUser(assignedName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}tasks/user/${assignedName}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
  addTask(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}tasks/add`, task, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  } 
  getAllTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}tasks/all`);
  } 
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}tasks/${taskId}`);
  }
  updateTaskRemarks(taskId: number, remarks: string): Observable<any> {
    return this.http.put(`${this.apiUrl}tasks/${taskId}/remarks`, remarks, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
    });
  } 
  updateTaskStatus(taskId: number, status: string): Observable<any> {
    const body = { status }; 
    return this.http.put(`${this.apiUrl}tasks/${taskId}`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'json',
    });
  }
}
