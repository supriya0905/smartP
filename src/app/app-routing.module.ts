import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteLayoutComponent } from './site-layout/site-layout.component'
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { ModulemasterComponent } from './master/modulemaster/modulemaster.component';
import { SubmodulemasterComponent } from './master/submodulemaster/submodulemaster.component';
import { ClientComponent } from './master/client/client.component';
import { CameraComponent } from './dashboard subview/camera/camera.component';
import { SensorComponent } from './dashboard subview/sensor/sensor.component';
import { MeterComponent } from './dashboard subview/meter/meter.component';
import { TicketComponent } from './dashboard subview/ticket/ticket.component';
import { EnforcementComponent } from './enforcement/enforcement.component'
import { StateComponent } from './master/state/state.component';
import { CityComponent } from './master/city/city.component';
import { CountryComponent } from './master/country/country.component';
import { ReportingComponent } from './reporting/reporting.component'
import { BookingComponent } from './booking/booking.component'
import { LocationComponent } from './location/location.component';
import { FOCComponent } from './operations/foc/foc.component';
import { MessageComponent } from './operations/message/message.component';
import { DirectAccessGuard } from './service/directaccessgaurd.service';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component'
import { AllComponent } from './dashboard subview/all/all.component';
import { ZonecameraComponent } from './operations/zonecamera/zonecamera.component';
import { LocationzoneComponent } from './operations/locationzone/locationzone.component';
import { CameraslotComponent } from './operations/cameraslot/cameraslot.component';
import { LocationslotComponent } from './locationslot/locationslot.component';
import { AllOccupancyComponent } from './all-occupancy/all-occupancy.component'

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // App routes goes here here
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      // { path: 'Dashboard', component: DashboardComponent},
      {path:'Dashboard', component:AllComponent},
      { path: 'User', component: UserComponent,canActivate: [DirectAccessGuard] },
      { path: 'Role', component: RoleComponent,canActivate: [DirectAccessGuard] },
      { path: 'Location', component: LocationComponent },
      { path: 'Module', component: ModulemasterComponent,canActivate: [DirectAccessGuard] },
      { path: 'SubModule', component: SubmodulemasterComponent,canActivate: [DirectAccessGuard] },
      { path: 'Client', component: ClientComponent,canActivate: [DirectAccessGuard] },
      { path: 'Camera', component: CameraComponent,canActivate: [DirectAccessGuard] },
      { path: 'Sensor', component: SensorComponent,canActivate: [DirectAccessGuard]},
      { path: 'Ticketing App', component:TicketComponent,canActivate: [DirectAccessGuard]},
      { path: 'Meter', component: MeterComponent,canActivate: [DirectAccessGuard] },
      { path: 'Enforcement', component: EnforcementComponent },
      { path: 'Country', component: CountryComponent,canActivate: [DirectAccessGuard] },
      { path: 'State', component: StateComponent,canActivate: [DirectAccessGuard] },
      { path: 'City', component: CityComponent,canActivate: [DirectAccessGuard] },
      { path: 'FOC', component: FOCComponent,canActivate: [DirectAccessGuard] },
      { path: 'Message', component: MessageComponent,canActivate: [DirectAccessGuard] },
      { path: 'Booking', component: BookingComponent },
      { path: 'Reporting', component: ReportingComponent },
      { path: 'LocationZone', component: LocationzoneComponent },
      { path: 'ZoneCamera', component: ZonecameraComponent },
      { path: 'CameraSlot', component: CameraslotComponent },
      { path: 'LocationSlot', component: LocationslotComponent },
      { path: 'AllOccupancy', component: AllOccupancyComponent },
    ]
  },

  //no layout routes
  { path: 'login', component: LoginComponent },
  // otherwise redirect to home
  { path: 'PageNotFound', component: PagenotfoundComponent},
  { path: '**', redirectTo: 'PageNotFound' }
];

export const routing = RouterModule.forRoot(appRoutes);