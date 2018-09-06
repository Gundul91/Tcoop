import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MyMap extends Component {
  render() {
    // styles to add at the map
    const style = {
      float: 'right',
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }

    return (
      <div className="map">
        <Map
          google={this.props.google}
          onClick={props => this.props.onMapClicked(props)}
          style={style}
          initialCenter={this.props.center}
          zoom={this.props.zoom}
        >
        {/* Add a marker for each place */}
        {this.props.places.map((location, index) => {
          return (<Marker
            key={index + "marker"}
            onClick={(props, marker) => this.props.onMarkerClick(props, marker)}
            title={location.name}
            name={location.name}
            position={location.location}
            id={location.id}
            ref={this.props.markerCreated}
          />)
        })}

        <InfoWindow
          marker={this.props.activeMarker}
          onClose={this.props.onMapClicked}
          visible={this.props.showingInfoWindow}>
            <div>
              <h1 className="place-name">{this.props.selectedPlace.name}</h1>
              {/* Add an image if there is */}
              {this.props.urlPhoto !== "" &&
                (<img className="photo" src={this.props.urlPhoto} alt="InfoWindow Image"></img>)
              }
            </div>
        </InfoWindow>
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ( "AIzaSyCjGfazU6dDNEmytBQ1oEe3p71QFpHFLiA" )
})(MyMap)
