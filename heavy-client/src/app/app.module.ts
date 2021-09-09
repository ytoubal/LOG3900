import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";

import { MatDividerModule } from "@angular/material/divider";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

import { AppRoutingModule, routingComponents } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { MessageInputComponent } from "./components/chatbox/message-input/message-input.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ToolbarComponent } from "./components/menu/toolbar/toolbar.component";
import { MessageListComponent } from "./components/chatbox/message-list/message-list.component";
import { NewRoomDialogComponent } from "./components/chatbox/new-room-dialog/new-room-dialog.component";
import { MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { ProfileComponent } from "./components/profile/profile.component";
import { SignupComponent } from "./components/signup/signup.component";
import { ToolsComponent } from "./components/drawing/tools/tools.component";
import { AttributsPanelComponent } from "./components/drawing/attributs-panel/attributs-panel.component";
import { CanvasComponent } from "./components/drawing/canvas/canvas.component";
import { ColourModalComponent } from "./components/drawing/colour-modal/colour-modal.component";
import { ColourPaletteComponent } from "./components/drawing/colour/colour-palette/colour-palette.component";
import { ColourSliderComponent } from "./components/drawing/colour/colour-slider/colour-slider.component";
import { ColourComponent } from "./components/drawing/colour/colour.component";
import { OpacitySliderComponent } from "./components/drawing/colour/opacity-slider/opacity-slider/opacity-slider.component";
import { modalComponents } from "./components/drawing/modal/modal.component";
import { PaletteService } from "./services/drawing/palette.service";
import { AppGlobals } from "./app.global";

import { EditProfileModalComponent } from "./components/profile/edit-profile-modal/edit-profile-modal.component";
import { WaitingRoomComponent } from "./components/waiting-room/waiting-room.component";
import { ChatComponent } from "./components/waiting-room/chat/chat.component";
import { CreateLobbyComponent } from "./components/menu/create-lobby/create-lobby.component";
import { EndGameDialogComponent } from "./components/drawing/workplace-page/end-game-dialog/end-game-dialog.component";
import { CreatePairComponent } from "./components/create-pair/create-pair.component";
import { LeaderboardComponent } from "./components/leaderboard/leaderboard.component";
import { SettingsComponent } from "./components/settings/settings.component";

import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { LevelUpDialogComponent } from "./components/drawing/workplace-page/level-up-dialog/level-up-dialog/level-up-dialog.component";
import { TutorialComponent } from "./components/tutorial/tutorial.component";
import { FirstTimeComponent } from "./components/menu/first-time/first-time.component";
import { WelcomeDialogComponent } from "./components/tutorial/welcome-dialog/welcome-dialog.component";
import { PreviewCanvasComponent } from "./components/create-pair/preview-canvas/preview-canvas/preview-canvas.component";
import { WarningDialogComponent } from "./components/warning-dialog/warning-dialog/warning-dialog.component";
import { CustomMatPaginatorIntl } from "./customMatPaginatorIntl";

// function countdownConfigFactory(): CountdownGlobalConfig {
//   return { format: `mm:ss` };
// }

// required for AOT compilation
export function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MessageInputComponent,
    MenuComponent,
    ToolbarComponent,
    MessageListComponent,
    ProfileComponent,
    NewRoomDialogComponent,
    SignupComponent,
    ToolsComponent,
    AttributsPanelComponent,
    routingComponents,
    CanvasComponent,
    ColourComponent,
    ColourSliderComponent,
    ColourPaletteComponent,
    ColourModalComponent,
    OpacitySliderComponent,
    modalComponents,

    EditProfileModalComponent,

    WaitingRoomComponent,

    ChatComponent,

    CreateLobbyComponent,

    EndGameDialogComponent,
    CreatePairComponent,
    LeaderboardComponent,
    SettingsComponent,
    TutorialComponent,
    LevelUpDialogComponent,
    FirstTimeComponent,
    WelcomeDialogComponent,
    PreviewCanvasComponent,
    WarningDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatCardModule,
    HttpClientModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatPaginatorModule,
    MatStepperModule,
    MatIconModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatProgressBarModule,
    MatBadgeModule,
    MatButtonModule,
    MatTabsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    AppRoutingModule,
    MatDividerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    NewRoomDialogComponent,
    EditProfileModalComponent,
    modalComponents,
    ColourModalComponent,
    EndGameDialogComponent,
    CreateLobbyComponent,
    LevelUpDialogComponent,
    FirstTimeComponent,
    WelcomeDialogComponent,
    WarningDialogComponent,
  ],

  exports: [RouterModule],
  providers: [
    NgxSpinnerService,
    PaletteService,
    AppGlobals,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
