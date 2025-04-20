import { Component, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-photo-upload',
  imports: [],
  templateUrl: './photo-upload.component.html',
  styleUrl: './photo-upload.component.css'
})
export class PhotoUploadComponent {
  // Setup the photoURL which can be defined
  @Input() photoURL: string = 'imgs/logo.png';

  // Setup the base64 image string which can be returned
  @Output() base64String = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes["photoURL"]) {
      // Check if the photoURL is not empty
      if (this.photoURL) {
        // Set the photoURL to the input value
        this.photoURL = changes["photoURL"].currentValue;
      } else {
        // Set the photoURL to the default value
        this.photoURL = 'imgs/logo.png';
      }
    }
  }

  // When a file is selected convert it to base64 string
  onFileSelected(event: Event): void {
    // Get the input selected
    const input = event.target as HTMLInputElement;

    // Check if there are any files selected
    if (input.files && input.files[0]) {

      // Make a file reader to read the file
      const reader = new FileReader();

      // Read the file
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Set the url to the file path
        this.photoURL = e.target?.result as string;
        
        // Convert the file to base64 string
        this.base64String.emit(reader.result as string);
      };

      // Read only the first file as we don't do multiple files
      reader.readAsDataURL(input.files[0]);
    }
  }
}
