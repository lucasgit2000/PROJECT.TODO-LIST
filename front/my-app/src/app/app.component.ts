import { Component } from '@angular/core';
import {
  faArrowRight,
  faArrowLeft,
  faCheckSquare,
  faListAlt,
  faCheck,
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
  faCheck = faCheck;
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  public DoneTabSelected: boolean = false;

  public DoneTasks: Array<any> = [];
  public PendingTasks: Array<any> = [];

  private description: string;
  private supervisor_name: string;
  private supervisor_email: string;
  private task_update_id: string;
  private task_update_status: string;
  private supervisor_password: string;

  ngOnInit() {
    this.populateTasksByStatus('pending');
  }

  openModal(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openModalWithTask(content, task) {
    console.log(task);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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
      if (status === 'done') {
        this.DoneTasks = await (await axios.get(`${baseUrl}/tasks/${status}`))
          .data;
        this.DoneTabSelected = true;
      }

      if (status === 'pending') {
        this.PendingTasks = await (
          await axios.get(`${baseUrl}/tasks/${status}`)
        ).data;
        this.DoneTabSelected = false;
      }
      console.log(this.DoneTasks);
      console.log(this.PendingTasks);
    } catch (error) {
      alert(
        'error! ' + error.response && error.response !== undefined
          ? error.response.data.message
          : error
      );
    }
  }

  public async newTask() {
    try {
      const data = {
        description: this.description,
        supervisor_name: this.supervisor_name,
        supervisor_email: this.supervisor_email,
      };
      const response = await axios.post(`${baseUrl}/tasks`, data);
      console.log('newTask');
      console.log(response);
      await this.populateTasksByStatus('pending');
      alert('new task created with success!');
    } catch (error) {
      console.log(error);
      alert(
        'error! ' + error.response && error.response !== undefined
          ? error.response.data.message
          : error
      );
    }
    console.log(this.PendingTasks);
    this.modalService.dismissAll();
  }

  public async updateTaskStatus() {
    try {
      await axios.put(`${baseUrl}/tasks`, {
        data: {
          taskId: this.task_update_id,
          taskStatus: this.task_update_status,
          password: this.supervisor_password,
        },
      });
      await this.populateTasksByStatus(this.task_update_status);
      alert('task updated with success!');
    } catch (error) {
      alert(
        'error! ' + error.response && error.response !== undefined
          ? error.response.data.message
          : error
      );
    }
    this.supervisor_password = null;
  }

  public async newTasksForIdleUser() {
    try {
      await axios.post(`${baseUrl}/tasks`);
      await this.populateTasksByStatus('pending');
      console.log(this.PendingTasks);
      alert('3 new tasks were added with success!');
    } catch (error) {
      alert(
        'error! ' + error.response && error.response !== undefined
          ? error.response.data.message
          : error
      );
    }
  }
}
