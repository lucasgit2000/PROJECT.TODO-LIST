import { Component } from '@angular/core';
import {
  faArrowRight,
  faArrowLeft,
  faCheckSquare,
  faListAlt,
} from '@fortawesome/free-solid-svg-icons';
import axios, { baseUrl } from './infrastructure/axios';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  public DoneTasks: Array<any>;
  public PendingTasks: Array<any>;

  ngOnInit() {
    this.populateTasksByStatus('pending');
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public async populateTasksByStatus(status: string) {
    try {
      if (status === 'done')
        this.DoneTasks = await axios.get(`${baseUrl}/tasks/${status}`);
      if (status === 'pending')
        this.PendingTasks = await axios.get(`${baseUrl}/tasks/${status}`);
      console.log(this.DoneTasks);
      console.log(this.PendingTasks);
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
      console.log(this.PendingTasks);
      alert("new task created with success!")
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
      alert("task updated with success!")
    } catch (error) {
      alert(error);
    }
  }
  private async newTasksForIdleUser() {
    try {
      await axios.post(`${baseUrl}/tasks`);
      await this.populateTasksByStatus('pending');
      console.log(this.PendingTasks);
      alert("3 new tasks were added with success!")
    } catch (error) {
      alert(error);
    }
  }
}
