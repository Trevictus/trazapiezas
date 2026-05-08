import axios from "axios";

export interface ExternalVehicleData {
  brand: string;
  model: string;
  vin: string;
  engineCode: string;
  year: number;
}

const MOCK_VEHICLES: { [key: string]: ExternalVehicleData } = {
  "1234ABC": {
    brand: "PEUGEOT",
    model: "3008",
    vin: "VF3CCYM20H123456",
    engineCode: "DV6TED4",
    year: 2021
  },
  "5678XYZ": {
    brand: "RENAULT",
    model: "CLIO",
    vin: "VF1AJ200456789012",
    engineCode: "K7M690",
    year: 2019
  },
  "9012DEF": {
    brand: "CITROËN",
    model: "C3",
    vin: "VR7CCSKZ032456789",
    engineCode: "TU3JP",
    year: 2020
  }
};

export class ExternalApiService {
  private static readonly TALLERGP_API_BASE = "https://api.tallergp.com/v1";
  private static readonly TALLERGP_API_KEY = process.env.TALLERGP_API_KEY || "";

  static async getVehicleByPlate(plate: string): Promise<ExternalVehicleData> {
    const normalizedPlate = plate.toUpperCase().trim();
    
    if (this.TALLERGP_API_KEY) {
      return this.fetchFromRealAPI(normalizedPlate);
    }
    
    if (MOCK_VEHICLES[normalizedPlate]) {
      return Promise.resolve(MOCK_VEHICLES[normalizedPlate]);
    }

    return Promise.reject(
      new Error(`Vehículo ${normalizedPlate} no encontrado en base de datos local`)
    );
  }

  private static async fetchFromRealAPI(
    plate: string
  ): Promise<ExternalVehicleData> {
    try {
      const response = await axios.get(
        `${this.TALLERGP_API_BASE}/vehicle/${plate}`,
        {
          headers: {
            Authorization: `Bearer ${this.TALLERGP_API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 5000
        }
      );

      return {
        brand: response.data.brand || response.data.make,
        model: response.data.model,
        vin: response.data.vin || response.data.chassis,
        engineCode: response.data.engineCode || response.data.engine_code,
        year: response.data.year || new Date().getFullYear()
      };
    } catch (error) {
      console.error(`Error fetching vehicle data for plate ${plate}:`, error);
      throw error;
    }
  }
}
