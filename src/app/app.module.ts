import { BrowserModule } from '@angular/platform-browser';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './service/login.service';
import { RoleService } from './service/role.service';
import { UserService } from './service/user.service';
import { AuthService } from './service/auth.service';
import { ModuleService } from './service/module.service';
import { SubModuleService } from './service/submodule.service';
import { ClientService } from './service/client.service';
import { DashboardService } from './service/dashboard.service';
import { TicketService } from './service/ticketingapp.service';
import { ReportService } from './service/report.service';
import { EnforcementService } from './service/enforcement.service';
import { ControlmasterService } from './service/controlmaster.service';
import { LocationService } from './service/location.service'
import { AppComponent } from './app.component';
import { routing } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SiteLayoutComponent } from './site-layout/site-layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ModalModule } from 'ngx-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ModulemasterComponent } from './master/modulemaster/modulemaster.component';
import { SubmodulemasterComponent } from './master/submodulemaster/submodulemaster.component';
import { DatePipe } from '@angular/common';



//overlay
import { OverlayComponent } from './overlay/overlay.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { OverlayService } from './service/overlay.service';
import { ClientComponent } from './master/client/client.component';
import { CameraComponent } from './dashboard subview/camera/camera.component';
import { SensorComponent } from './dashboard subview/sensor/sensor.component';
import { MeterComponent } from './dashboard subview/meter/meter.component';
import { TicketComponent} from './dashboard subview/ticket/ticket.component';
import { EnforcementComponent } from './enforcement/enforcement.component';
import { CameraEnforcementComponent } from './Enforcement Subview/camera-enforcement/camera-enforcement.component';
import { MeterEnforcementComponent } from './Enforcement Subview/meter-enforcement/meter-enforcement.component';
import { SensorEnforcementComponent } from './Enforcement Subview/sensor-enforcement/sensor-enforcement.component';
import { TicketEnforcementComponent } from './Enforcement Subview/ticket-enforcement/ticket-enforcement.component';
import { CountryComponent } from './master/country/country.component';
import { StateComponent } from './master/state/state.component';
import { CityComponent } from './master/city/city.component';
import { BookingComponent } from './booking/booking.component';
import { LocationComponent } from './location/location.component';
import { DoughnutslotComponent } from './Chart/doughnutslot/doughnutslot.component';
import { FOCComponent } from './operations/foc/foc.component';
import { MessageComponent } from './operations/message/message.component';
import { DirectAccessGuard } from './service/directaccessgaurd.service';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AllComponent } from './dashboard subview/all/all.component';
import { DashboardbarComponent } from './Chart/dashboardbar/dashboardbar.component';
import { DoughnutdashboardComponent } from './Chart/doughnutdashboard/doughnutdashboard.component';
import { DashboardpieComponent } from './Chart/dashboardpie/dashboardpie.component';
import { DashboardlineComponent } from './Chart/dashboardline/dashboardline.component';
import { DashboardstackedComponent } from './Chart/dashboardstacked/dashboardstacked.component';
import { ModeofpaymentdoughnutComponent } from './Chart/modeofpaymentdoughnut/modeofpaymentdoughnut.component';
import { ReportingComponent } from './reporting/reporting.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LocationzoneComponent } from './operations/locationzone/locationzone.component';
import { ZonecameraComponent } from './operations/zonecamera/zonecamera.component';
import { CameraslotComponent } from './operations/cameraslot/cameraslot.component';
import { LocationslotComponent } from './locationslot/locationslot.component';
import { DemochartComponent } from './Chart/demochart/demochart.component';
import { DemocomponentComponent } from './democomponent/democomponent.component';
import { AppbookingComponent } from './Chart/appbooking/appbooking.component';
import { AllOccupancyComponent } from './all-occupancy/all-occupancy.component';
import { SortPipe } from './dashboard subview/all/all.pipe';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RoleComponent,
    SiteLayoutComponent,
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    ModulemasterComponent,
    SubmodulemasterComponent,
    OverlayComponent,
    ClientComponent,
    CameraComponent,
    SensorComponent,
    MeterComponent,
    TicketComponent,
    EnforcementComponent,
    CameraEnforcementComponent,
    MeterEnforcementComponent,
    SensorEnforcementComponent,
    TicketEnforcementComponent,
    CountryComponent,
    StateComponent,
    CityComponent,
    BookingComponent,
    LocationComponent,
    DoughnutslotComponent,
    FOCComponent,
    MessageComponent,
    PagenotfoundComponent,
    AllComponent,
    DashboardbarComponent,
    DoughnutdashboardComponent,
    DashboardpieComponent,
    DashboardlineComponent,
    DashboardstackedComponent,
    ModeofpaymentdoughnutComponent,
    ReportingComponent,
    LocationzoneComponent,
    ZonecameraComponent,
    CameraslotComponent,
    LocationslotComponent,
    DemochartComponent,
    DemocomponentComponent,
    AppbookingComponent,
    AllOccupancyComponent,
    SortPipe
  ],
  imports: [
    BrowserModule,
    DeferLoadModule,
    routing,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    OverlayModule,
    BsDatepickerModule.forRoot(),
    ProgressbarModule.forRoot(),
        
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AuthenticationService,
    RoleService,
    AuthService,
    UserService,
    ModuleService,
    SubModuleService,
    ClientService,
    DashboardService,
    TicketService,
    OverlayService,
    EnforcementService,
    ControlmasterService,
    LocationService,
    DirectAccessGuard,
    ReportService,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
