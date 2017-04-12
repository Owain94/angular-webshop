declare module postalcodeInterface {
    export interface City {
        id: string;
        label: string;
    }

    export interface Properties {
        name: string;
    }

    export interface Crs {
        type: string;
        properties: Properties;
    }

    export interface Wgs84 {
        crs: Crs;
        coordinates: number[];
        type: string;
    }

    export interface Center {
        wgs84: Wgs84;
    }

    export interface Geo {
        center: Center;
    }

    export interface Nen5825 {
        streets: string[];
        postcode: string;
    }

    export interface Province {
        id: string;
        label: string;
    }

    export interface Municipality {
        id: string;
        label: string;
    }

    export interface Self {
        href: string;
    }

    export interface Links {
        self: Self;
    }

    export interface RootObject {
        city: City;
        geo: Geo;
        nen5825: Nen5825;
        postcode: string;
        province: Province;
        streets: string[];
        municipality: Municipality;
        _links: Links;
    }
}
