import { Component, ElementRef, NgZone, ViewChild } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation";
import { LoadingController } from "ionic-angular";
import { google } from "google-maps";
declare var google: google;

import {
  GoogleMapsEvent,
  GoogleMapOptions,
  GoogleMaps,
  GoogleMap,
} from "@ionic-native/google-maps";

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
  marker: any;
  markPosition: Object;
  @ViewChild("mapElement") mapNativeElement: ElementRef;

  constructor(
    public zone: NgZone,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController
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
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: resp.coords.latitude, lng: resp.coords.longitude },
          zoom: 15,
        });

        this.addMaker(resp.coords.latitude, resp.coords.longitude, this.map, false);
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });

  }

  tryGeolocation() {
    this.clearMarkers();
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: resp.coords.latitude, lng: resp.coords.longitude },
          zoom: 15,
        });
        this.addMaker(resp.coords.latitude, resp.coords.longitude, this.map, false);
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

        this.map = new google.maps.Map(document.getElementById("map"), {
          center: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          },
          zoom: 15,
        });
        this.markPosition = { lat: position.lat(), lng: position.lng() };
        this.addMaker(position.lat(), position.lng(), this.map, false);
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

  private addMaker(lat: number, lng: number, map, selected) {
    if (selected) {
      this.map.setCenter(this.markPosition);
    }
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      draggable: true,
    });
    google.maps.event.addListener(marker, "dragend", function () {
      this.marker = marker;
      this.map.setCenter(this.markPosition);
    });
  }
}
