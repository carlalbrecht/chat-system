import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: "root"
})
export class MediaService {

  constructor(
    public http: HttpClient,
    @Inject("BASE_URL") private HOST: string
  ) { }


  public selectAndUploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Prepare file open dialog
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      // Dialog submit handler
      input.onchange = e => {
        // Bail early if this event was fired after the user cancelled the dialog
        if (e.target["files"].length == 0) reject();

        const file = e.target["files"][0];

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async e => {
          interface Response {
            success: boolean;

            error?: any;
            id?: string;
          }

          const headers = new HttpHeaders().set("Content-Type", file.type);

          const response = await this.http.post<Response>(
            `${this.HOST}/api/multipost`, e.target["result"], { headers: headers }
          ).toPromise();

          if (response.success) {
            resolve(response.id);
          } else {
            reject(response.error);
          }
        }
      }

      // Open file dialog
      input.click();
    });
  }

}
