import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClientStateService} from '../../../sub-modules/client';
import {NavigationService} from '../../../services/navigation.service';

const NAME_MIN_LENGTH: number = 4;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _clientState: ClientStateService,
    private _nav: NavigationService
  ) { }

  form: FormGroup;

  changeName(): void {
    if (!this.form || !this.form.valid) {
      return;
    }

    const {name} = this.form.value;
    this._clientState.changeClientName(name);
    this._nav.users();
  }

  ngOnInit() {
    this.form = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(NAME_MIN_LENGTH)]]
    });
  }

}
