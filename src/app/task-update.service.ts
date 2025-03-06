import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from 'src/app/headlogin/headlogin.component';  
@Injectable({
  providedIn: 'root',
})
export class TaskUpdateService {
  private taskSubject = new BehaviorSubject<Task[]>([]);  
  tasks$ = this.taskSubject.asObservable();  
  constructor() {} 
  updateTaskStatus(taskId: number, updatedStatus: string): void {
    const currentTasks = this.taskSubject.getValue();
    const index = currentTasks.findIndex((task) => task.id === taskId);
    if (index !== -1) {     
      currentTasks[index] = { ...currentTasks[index], status: updatedStatus };
      this.taskSubject.next([...currentTasks]);  
    }
  }
  updateTaskList(tasks: Task[]): void {
    this.taskSubject.next(tasks);  
  }
}
