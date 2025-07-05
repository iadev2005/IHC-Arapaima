export interface Fish {
    id: number;
    name: string;
    scientificName: string;
    description: string;
    habitat: string;
    diet: string;
    size: string;
    image: string;
}

export interface WaterQuality {
    ph: number;
    temperature: number;
    oxygen: number;
    turbidity: number;
    timestamp: string;
}

export interface WaterData {
    fishes: Fish[];
    quality: WaterQuality[];
} 