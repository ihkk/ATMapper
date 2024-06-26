// GeoPoint class definition
// GeoPoint component is a form input for a latitude and longitude, with PosName, AnimeName

export default class GeoPoint {
    // Constructor for the GeoPoint class
    constructor(id, posName, animeName, latitude, longitude, pic, ep, s, image) {
        this.id = id;
        this.posName = posName;
        this.animeName = animeName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.pic = pic;
        this.ep = ep;
        this.s = s;
        this.image = image;
    }

    // Getter methods for properties
    getID() {
        return this.id;
    }
    getPosName() {
        return this.posName;
    }

    getAnimeName() {
        return this.animeName;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }

    // Setter methods for properties
    setPosName(posName) {
        this.posName = posName;
    }

    setAnimeName(animeName) {
        this.animeName = animeName;
    }

    setLatitude(latitude) {
        this.latitude = latitude;
    }

    setLongitude(longitude) {
        this.longitude = longitude;
    }

    // Method to display the GeoPoint information
    displayInfo() {
        console.log(`Position Name: ${this.posName}, Anime Name: ${this.animeName}, Coordinates: (${this.latitude}, ${this.longitude})`);
    }
}
