import { Injectable } from "@angular/core";

import { ModalDialogComponent } from "src/app/components/modal-dialog/modal-dialog.component";


@Injectable({
  providedIn: "root"
})
export class ModalService {

  private modals: ModalDialogComponent[] = [];


  public add(modal: ModalDialogComponent) {
    this.modals.push(modal);
  }


  public remove(id: string) {
    this.modals = this.modals.filter(x => x.id !== id);
  }


  public open(id: string) {
    this.modals.find(x => x.id === id).open();
  }


  public close(id: string) {
    this.modals.find(x => x.id === id).close();
  }

}
