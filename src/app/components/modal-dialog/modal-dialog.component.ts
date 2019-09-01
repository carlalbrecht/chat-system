import { Component, ElementRef, OnInit, OnDestroy, Input } from "@angular/core";

import { ModalService } from "src/app/services/modal.service";


@Component({
  selector: "modal-dialog",
  templateUrl: "./modal-dialog.component.html",
  styleUrls: ["./modal-dialog.component.scss"]
})
export class ModalDialogComponent implements OnInit, OnDestroy {

  @Input() id: string;

  private element: HTMLDivElement;


  constructor(
    private elementRef: ElementRef,
    private modal: ModalService
  ) {
    this.element = elementRef.nativeElement;
    this.element.style.display = "none";
  }


  public ngOnInit() {
    if (this.id === undefined) {
      throw new Error("Modal must have an id attribute");
    }

    document.body.appendChild(this.element);
    this.modal.add(this);
  }


  public ngOnDestroy() {
    this.modal.remove(this.id);
    this.element.remove();
  }


  public open() {
    this.element.style.display = "block";

    for (let child of Array.from(this.element.children)) {
      child.classList.add("visible");
    }

    document.body.classList.add("modal-visible");
  }


  public close() {
    this.element.style.display = "none";

    for (let child of Array.from(this.element.children)) {
      child.classList.remove("visible");
    }

    document.body.classList.remove("modal-visible");
  }

}
