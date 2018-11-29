import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {SignupComponent} from './pages/signup/signup.component';
import {LoginComponent} from './pages/login/login.component';
import {DonatorComponent} from './pages/donator/donator.component';
import {DoctorComponent} from './pages/doctor/doctor.component';
import {PersonalComponent} from './pages/personaltr/personaltr.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'donator', component: DonatorComponent},
  {path: 'doctor', component: DoctorComponent},
  {path: 'personaltr', component: PersonalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
