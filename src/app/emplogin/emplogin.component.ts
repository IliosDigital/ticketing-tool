import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user.service';
import { DatePipe } from '@angular/common';
import { TaskUpdateService } from '../task-update.service';
import { Router } from '@angular/router';
export interface Task {
  id?: number;
  taskName: string;
  description: string;
  date: string;
  assignedName: string;
  status: string;
  category: string;
  remarks: string;
  tier: string;
}
@Component({
  selector: 'app-emplogin',
  templateUrl: './emplogin.component.html',
  styleUrls: ['./emplogin.component.css'],
  providers: [DatePipe]
})
export class EmploginComponent implements OnInit {
  tasks: Task[] = []; 
  filteredTasks: Task[] = []; 
  tasksVisible = false; 
  isLoading = false; 
  selectedCategory: string = 'all'; 
  taskCountByStatus: { [key: string]: number } = {};
  private apiUrl = 'http://localhost:8080/api';
  constructor(
    private userService: UserService,
    private datePipe: DatePipe,
    private taskUpdateService: TaskUpdateService,
    private http: HttpClient,
    private router: Router
  ) {}
  ngOnInit(): void {
    const loggedInUser = localStorage.getItem('userName'); 
    if (loggedInUser) {
      this.fetchAssignedTasks(loggedInUser);
    } else {
      console.warn('No user logged in. Unable to fetch assigned tasks.');
    }
    this.fetchAssignedTasks;
  }
  fetchAssignedTasks(userName: string): void {
    this.isLoading = true; 
    this.userService.getTasksByAssignedUser(userName).subscribe(
      (data: Task[]) => {
        console.log('API Response:', data);    
        this.tasks = data.map((task) => ({
          ...task,
          category: task.category ? task.category.toLowerCase() : 'open',
          tier: task.tier || 'default',
        }));
        this.countTasksByStatus();
        this.filteredTasks = [...this.tasks]; 
        this.tasksVisible = true; 
        this.isLoading = false; 
        this.taskUpdateService.updateTaskList(this.tasks); 
      },
      (error) => {
        console.error('Error fetching assigned tasks:', error);
        this.isLoading = false; 
      }
    );
  } 

  countTasksByStatus(): void {
    // Reset the counts before updating
    this.taskCountByStatus = {
      'Open': 0,
      'WIP': 0,
      'Querry Raised': 0,
      'Peer Review': 0,
      'Head Review': 0,
      'Lead Review': 0,
      'Completed': 0
    };
    this.tasks.forEach((task) => {
      if (this.taskCountByStatus[task.status]) {
        this.taskCountByStatus[task.status]++;
      }
    });
  }




  updateTaskStatus(taskId: number, status: string, tier: string, taskName: string, description: string, date: string, assignedName: string, remarks: string) {
    const updatedTask = {
      id: taskId,  
      status: status.trim(),
      tier: tier, 
      taskName: taskName, 
      description: description, 
      date: date, 
      assignedName:assignedName, 
      remarks:remarks,
    }; 
    console.log("Sending request to update task:", updatedTask);
    this.http.put<Task>(`http://localhost:8080/api/tasks/${taskId}`, updatedTask, {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).subscribe(
      (response: Task) => {  // Here we expect the response to be a Task
        console.log('Task updated successfully', response);
        const updatedIndex = this.tasks.findIndex(task => task.id === taskId);
      if (updatedIndex !== -1) {
        this.tasks[updatedIndex] = response; // Replace old task with updated task
        this.filteredTasks = [...this.tasks]; // Update filtered tasks to reflect the change
      }
      this.countTasksByStatus();
      this.taskUpdateService.updateTaskList(this.tasks);
      },
        error => {
          console.error('Error updating task:', error);
        }
      );
  }  
  private updateTaskInList(updatedTask: Task) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.taskUpdateService.updateTaskList(this.tasks); 
    }
  }
  logout() {
    localStorage.removeItem('userName');
    this.router.navigate(['/login']); 
  }
  filterTasks(category: string): void {
    this.selectedCategory = category; 
    console.log(`Filtering tasks for category: ${category}`);
    if (category === 'all') {
      this.filteredTasks = [...this.tasks]; 
    } else {
      this.filteredTasks = this.tasks.filter(
        (task) => task.category.toLowerCase() === category.toLowerCase() 
      );
    }
    if (this.filteredTasks.length === 0) {
      console.warn(`No tasks found for category: ${category}`);
    }
    this.tasksVisible = true; 
  }
  onStatusChange(task: Task): void {
    console.log(`Task "${task.description}" changed to status: ${task.status}`);
    if (task.status === 'Completed' && task.tier === 'PRICING') {
      task.tier = 'SOW'; 
    }
    this.updateTaskStatus(task.id!, task.status, task.tier, task.taskName, task.description, task.date, task.assignedName, task.remarks);
    this.countTasksByStatus();   
  } 
  getTotalTaskCount(): number {
    return this.tasks.length;
  }
  onRemarksChange(task: Task): void {   
    if (task.id && task.remarks) {    
      this.userService.updateTaskRemarks(task.id, task.remarks).subscribe(
        (updatedTask) => {
          console.log('Task remarks updated:', updatedTask);         
          const index = this.tasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            this.tasks[index].remarks = updatedTask.remarks;
            this.taskUpdateService.updateTaskList(this.tasks); 
          }
        },
        (error) => {
          console.error('Error updating task remarks:', error);
        }
      );
    }
  }
}
