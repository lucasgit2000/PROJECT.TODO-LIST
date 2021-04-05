import { Component } from '@angular/core';
import {
  faArrowRight,
  faArrowLeft,
  faCheckSquare,
  faListAlt,
  faCheck,
  faPlus,
  faHandHolding
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
  faPlus = faPlus;
  faHandHolding = faHandHolding;
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
    this.task_update_id = task.id;
    this.task_update_status =
      task.status.description === 'done'
        ? 'pending'
        : task.status.description;

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
      await axios.post(`${baseUrl}/tasks`, data);
      await this.populateTasksByStatus('pending');
      alert('new task created with success!');
      this.modalService.dismissAll();
    } catch (error) {
      alert(
        'error! ' + error.response && error.response !== undefined
          ? error.response.data.message
          : error
      );
    }
  }

  public async updateTaskStatus(task: any = null) {
    try {
      if (task !== null) {
        this.task_update_id = task.id;
        this.task_update_status =
          task.status.description === 'pending'
            ? 'done'
            : task.status.description;
        this.supervisor_password = null;
      }
      const data = {
        taskId: this.task_update_id,
        taskStatus: this.task_update_status,
        password: this.supervisor_password,
      };
      await axios.put(`${baseUrl}/tasks`, data);
      await this.populateTasksByStatus(this.DoneTabSelected ? "done" : "pending");
      alert('task updated with success!');
      this.modalService.dismissAll();
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
      await axios.post(`${baseUrl}/tasks/for_idle_user`);
      await this.populateTasksByStatus('pending');
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
