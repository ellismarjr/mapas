import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { TabsNavigationPage } from "../pages/tabs-navigation/tabs-navigation";
@Component({
  templateUrl: "app.html",
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      this.nav.push(TabsNavigationPage);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    // var firebaseConfig = {
    //   apiKey: "AIzaSyANtJfWEzPBfIFFLHaCvJUUbhBUCAb3V3I",
    //   authDomain: "ionic-test-89ec5.firebaseapp.com",
    //   projectId: "ionic-test-89ec5",
    //   storageBucket: "ionic-test-89ec5.appspot.com",
    //   messagingSenderId: "192983000610",
    //   appId: "1:192983000610:web:b10b8ee991b9aa75edcc7b",
    //   measurementId: "G-WRYY66YH6B",
    // };
    // // Initialize Firebase
    // firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
  }
}
