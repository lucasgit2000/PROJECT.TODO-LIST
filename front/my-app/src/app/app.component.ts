import { Component } from '@angular/core';
import {
  faArrowRight,
  faArrowLeft,
  faCheckSquare,
  faListAlt,
} from '@fortawesome/free-solid-svg-icons';
import axios, { baseUrl } from './infrastructure/axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'my-app';
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faListAlt = faListAlt;
  faCheckSquare = faCheckSquare;

  public DoneTasks: Array<any>;
  public PendingTasks: Array<any>;
  public NewTaskModalOpen: boolean = false;
  public UpdateTaskModalOpen: boolean = false;

  ngOnInit() {
    this.populateTasksByStatus('pending');
  }

  public async populateTasksByStatus(status: string) {
    try {
      if (status === 'done')
        this.DoneTasks = await axios.get(`${baseUrl}/tasks/${status}`);
      if (status === 'pending')
        this.PendingTasks = await axios.get(`${baseUrl}/tasks/${status}`);
      console.log(this.DoneTasks);
      console.log(this.PendingTasks);
      console.log(this.NewTaskModalOpen);
    } catch (error) {
      alert(error);
    }
  }
  private async newTask(
    description: string,
    supervisor_name: string,
    supervisor_email: string
  ) {
    try {
      this.PendingTasks.push(
        (
          await axios.post(`${baseUrl}/tasks`, {
            data: {
              description,
              supervisor_name,
              supervisor_email,
            },
          })
        ).data
      );
      this.NewTaskModalOpen = false;
      console.log(this.NewTaskModalOpen);
      console.log(this.PendingTasks);
    } catch (error) {
      alert(error);
    }
  }
  private async updateTaskStatus(
    taskId: number,
    taskStatus: string,
    taskPassword: string
  ) {
    try {
      await axios.put(`${baseUrl}/tasks`, {
        data: {
          taskId,
          taskStatus,
          taskPassword,
        },
      });
      await this.populateTasksByStatus(taskStatus);
      this.UpdateTaskModalOpen = false;
      console.log(this.UpdateTaskModalOpen);
    } catch (error) {
      alert(error);
    }
  }
  private async newTasksForIdleUser() {
    try {
      await axios.post(`${baseUrl}/tasks`);
      await this.populateTasksByStatus('pending');
      console.log(this.PendingTasks);
    } catch (error) {
      alert(error);
    }
  }
}
