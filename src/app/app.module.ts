import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation/';

import { MapPage } from "../pages/map/map";
import { TabsNavigationPage } from "../pages/tabs-navigation/tabs-navigation";
import { PlacesPage } from "../pages/places/places";
import { FirebaseAnalytics } from "@ionic-native/firebase-analytics";

import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp,
    MapPage, TabsNavigationPage, PlacesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage, TabsNavigationPage, PlacesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    FirebaseAnalytics
  ]
})
export class AppModule {}
