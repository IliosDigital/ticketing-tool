import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskUpdateService } from 'src/app/task-update.service';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
export interface Task {
  id?: number;
  taskName: string;  
  description: string;
  date: string;
  assignedName: string;
  status: string;
  remarks: string;
  tier: string;  
}
@Component({
  selector: 'app-headlogin',
  templateUrl: './headlogin.component.html',
  styleUrls: ['./headlogin.component.css'],
})
export class HeadloginComponent implements OnInit {
  employees: string[] = [];
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  users: string[] = [];
  isCreatingTask = false;
  editingTaskId: number | null = null;
  selectedStatus: string = 'all';
  selectedTier: string = '';
  employeeTaskCounts: { [key: string]: number } = {};
  newTask: Task = {
    taskName: '',  
    description: '',
    date: '',
    status: 'OPEN',
    assignedName: '',
    remarks: '',
    tier: ''
  };
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient, private taskUpdateService: TaskUpdateService, private router: Router) {}
  ngOnInit() {
    this.fetchUsers();
    this.fetchTasks();
    this.taskUpdateService.tasks$.subscribe((updatedTasks: Task[]) => {
      this.tasks = updatedTasks;
      this.filteredTasks = [...updatedTasks];
      this.updateEmployeeTaskCounts();
    });
  }
  fetchUsers() {
    this.http.get<any[]>(`${this.apiUrl}/users`).subscribe(
      (data) => {
        // Filter out Team Lead and Team Head from the users list
        this.users = data
          .filter((user) => user.level !== 'Team Lead' && user.level !== 'Team Head')
          .map((user) => user.name);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  logout() {
    this.users = [];
    this.tasks = [];
    this.filteredTasks = [];
    this.router.navigate(['/login']); 
  }
  fetchTasks() {
    this.http.get<Task[]>(`${this.apiUrl}/tasks/all`).subscribe(
      (data) => {
        this.tasks = data.map((task) => ({
          ...task,
          date: task.date.split('T')[0], 
        }));
        this.filteredTasks = [...this.tasks]; 
        this.taskUpdateService.updateTaskList(this.tasks);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  getTaskCountForEmployee(employeeName: string): number {
    return this.tasks.filter((task) => task.assignedName === employeeName).length;
  }

  updateEmployeeTaskCounts() {
    this.employeeTaskCounts = {}; // Clear previous counts
    this.tasks.forEach((task) => {
      if (task.assignedName) {
        if (this.employeeTaskCounts[task.assignedName]) {
          this.employeeTaskCounts[task.assignedName] += 1;
        } else {
          this.employeeTaskCounts[task.assignedName] = 1;
        }
      }
    });
  }

  get employeesWithTaskCount(): { name: string; count: number }[] {
    return Object.keys(this.employeeTaskCounts).map((name) => ({
      name,
      count: this.employeeTaskCounts[name],
    }));
  }


  getCategoryCount(category: string): number {
    return this.tasks.filter((task) => task.tier === category).length;
  }
  getTotalTaskCount(): number {
    return this.tasks.length;
  }
  getStatusCountForCategory(category: string, status: string): number {
    if (category === 'ALL') {
      return this.tasks.filter(
        (task) => task.status === status
      ).length;
    } else {
      return this.tasks.filter(
        (task) => task.tier === category && task.status === status
      ).length;
    }
  }
  filterByCategoryAndStatus(category: string, status: string) {
    if (category === 'ALL') {
      this.filteredTasks = this.tasks.filter(
        (task) => task.status === status
      );
    } else {
      this.filteredTasks = this.tasks.filter(
        (task) => task.tier === category && task.status === status
      );
    }
  }
  resetCategoryFilter() {
    this.filteredTasks = [...this.tasks];
  }
  getStatusCount(status: string): number {
    if (status === 'all') {
      return this.tasks.length;
    } else {
      return this.tasks.filter((task) => task.status === status).length;
    }
  }
  filterByStatus(status: string): void {
    if (status === 'all') {
      this.filteredTasks = this.tasks.filter(
        (task) => task.tier === this.selectedTier || this.selectedTier === ''
      );
    } else {
      this.filteredTasks = this.tasks.filter(
        (task) => task.status === status && (task.tier === this.selectedTier || this.selectedTier === '')
      );
    }
  }
  createTask() {
    this.isCreatingTask = true;
    this.editingTaskId = null;
    this.resetNewTask();
  }
  saveTask() {
    if (
      !this.newTask.taskName ||  
      !this.newTask.description ||
      !this.newTask.date ||
      !this.newTask.assignedName
    ) {
      window.alert('Please Fill In All Required Fields ILIOS DIGITAL EMPLOYEE Before Saving The Task.');
      return;
    }
    if (this.editingTaskId !== null) {
      this.http
        .put<Task>(`${this.apiUrl}/tasks/${this.editingTaskId}`, this.newTask, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        })
        .subscribe(
          (response) => {
            const index = this.tasks.findIndex((t) => t.id === this.editingTaskId);
            if (index !== -1) {
              this.tasks[index] = response;
            }
            this.filteredTasks = [...this.tasks];
            this.isCreatingTask = false;
            this.editingTaskId = null;
            this.resetNewTask();
            console.log('Task Updated Successfully', response);
          },
          (error) => {
            console.error('Error updating task:', error);
          }
        );
    } else {   
      this.http
        .post<Task>(`${this.apiUrl}/tasks/add`, this.newTask, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        })
        .subscribe(
          (response) => {
            this.tasks.push(response);
            this.filteredTasks = [...this.tasks];
            this.isCreatingTask = false;
            this.resetNewTask();
            console.log('Task created successfully', response);
          },
          (error) => {
            console.error('Error saving task:', error);
          }
        );
    }
  }
  editTask(task: Task) {
    this.newTask = { ...task };
    this.isCreatingTask = true;
    this.editingTaskId = task.id || null;
  }
  deleteTask(taskId: number | undefined) {
    if (!taskId) {
      console.error('Task ID is undefined, cannot delete task.');
      return;
    }
    this.http.delete(`${this.apiUrl}/tasks/${taskId}`).subscribe(
      () => {
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        this.filteredTasks = [...this.tasks];
        console.log('Task deleted successfully');
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );
  }
  resetNewTask() {
    this.newTask = {
      taskName: '',
      description: '',
      date: '',
      status: 'Open',
      assignedName: '',
      remarks: '',
      tier: ''
    };
  }
}
