import { Component, ElementRef, NgZone, ViewChild } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation";
import { LoadingController } from "ionic-angular";
import { google } from "google-maps";
declare var google: google;

import { GoogleMaps, GoogleMap } from "@ionic-native/google-maps";
import { FirebaseAnalytics } from "@ionic-native/firebase-analytics";

@Component({
  selector: "page-map",
  templateUrl: "map.html",
  providers: [GoogleMaps],
})
export class MapPage {
  google_map: GoogleMap;
  map: any;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any;
  autocompleteItems: any;
  loading: any;
  latitute: any;
  longitute: any;
  marker: google.maps.Marker;
  markPosition: Object;
  @ViewChild("mapElement") mapNativeElement: ElementRef;

  constructor(
    public zone: NgZone,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    private firebaseAnalytics: FirebaseAnalytics
  ) {
    this.geocoder = new google.maps.Geocoder();
    let elem = document.createElement("div");
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = {
      input: "",
    };
    this.autocompleteItems = [];
    this.markers = [];
    this.loading = this.loadingCtrl.create();

  }

  ionViewDidEnter() {
    this.loading.present();
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: resp.coords.latitude, lng: resp.coords.longitude },
          zoom: 15,
          disableDefaultUI: true,
        });
        const marker = new google.maps.Marker({
          position: { lat: resp.coords.latitude, lng: resp.coords.longitude },
          map: this.map,
          draggable: true,
        });
        this.marker = marker;
        this.addListeners(this.marker, this.map);
        this.loading.dismiss();
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
  }

  placeMarkerAndPanTo(latLng: google.maps.LatLng) {
    this.clearMarkers();
    this.marker.setPosition({ lat: latLng.lat(), lng: latLng.lng() });
    this.map.panTo(latLng);
  }

  tryGeolocation() {
    this.clearMarkers();
    this.firebaseAnalytics
    .logEvent('select_content', {
      content_type: 'image',
      content_id: 'P12453',
      items: [{ name: 'Kittens' }]
    });

    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.moveMarkerAndSetCenterMarkerOnMap(
          resp.coords.latitude,
          resp.coords.longitude
        );
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
  }

  updateSearchResults() {
    if (this.autocomplete.input == "") {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if (predictions) {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      }
    );
  }

  selectSearchResult(item) {
    this.clearMarkers();
    this.autocompleteItems = [];
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status === "OK" && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng,
        };
        this.moveMarkerAndSetCenterMarkerOnMap(position.lat(), position.lng());
      }
    });
  }

  clearMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i]);
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  moveMarkerAndSetCenterMarkerOnMap(lat: number, lng: number) {
    this.marker.setPosition({ lat, lng });
    this.markPosition = { lat, lng };
    this.map.setCenter(this.markPosition);
  }

  addListeners(marker: google.maps.Marker, map) {
    google.maps.event.addListener(marker, "dragend", function () {
      map.setCenter(this.markPosition);
    });
    this.map.addListener("click", (e) => {
      this.placeMarkerAndPanTo(e.latLng);
    });
  }
}
