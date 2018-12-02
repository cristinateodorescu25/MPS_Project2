import {Component, OnInit} from '@angular/core';
import {UiService} from '../../services/ui/ui.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-donator',
  templateUrl: 'donator.component.html',
  styleUrls: ['donator.component.css'],
})

export class DonatorComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;

  darkModeActive: boolean;

  constructor(public ui: UiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
        age: ['', [Validators.required, Validators.min(16),
                   Validators.max(60), Validators.pattern('^[0-9]*$')]],
        weight: ['', [Validators.required, Validators.min(50),
                      Validators.pattern('^[0-9]*$')]],
        bloodGr: ['', Validators.required],
        rh: ['', [Validators.required,  Validators.pattern('[+-]')]],
      });

      this.ui.darkModeState.subscribe((value) => {
        this.darkModeActive = value;
      });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
      this.submitted = true;

      if (this.registerForm.invalid) {
          return;
      }

      alert('Donație înregistrată!')
  }
}