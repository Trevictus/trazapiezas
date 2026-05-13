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
  private static readonly TALLERGP_API_BASE = "https://api.tallergp.com";
  private static readonly TALLERGP_API_KEY = process.env.TALLERGP_API_KEY || "";

  private static cleanPlate(plate: string): string {
    const cleaned = plate.toUpperCase().trim();
    if (cleaned.includes("-")) {
      return cleaned;
    }
    const match = cleaned.match(/^(\d+)([A-Z]+)$/);
    if (match) {
      return `${match[1]}-${match[2]}`;
    }
    return cleaned;
  }

  private static normalizeForAPIQuery(plate: string): string {
    return plate.replace("-", "");
  }

  static async getVehicleByPlate(plate: string): Promise<ExternalVehicleData> {
    const normalizedPlate = this.cleanPlate(plate);
    const apiQueryPlate = this.normalizeForAPIQuery(normalizedPlate);

    if (this.TALLERGP_API_KEY) {
      return this.fetchFromRealAPI(apiQueryPlate);
    }

    if (MOCK_VEHICLES[apiQueryPlate]) {
      return Promise.resolve(MOCK_VEHICLES[apiQueryPlate]);
    }

    return Promise.reject(
      new Error(`Vehículo ${normalizedPlate} no encontrado en base de datos local`)
    );
  }

  private static async fetchFromRealAPI(
    plate: string
  ): Promise<ExternalVehicleData> {
    try {
      const plateWithDash = plate.includes("-") ? plate : `${plate.slice(0, 4)}-${plate.slice(4)}`;
      const response = await axios.get(
        `${this.TALLERGP_API_BASE}/vehicles?plate=${plateWithDash}`,
        {
          headers: {
            Authorization: `Bearer ${this.TALLERGP_API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 5000
        }
      );

      console.log(`[TallerGP] Respuesta para matrícula ${plate}:`, response.data);
      const vehicleData = response.data.data[0];

      if (!vehicleData) {
        throw new Error(`Vehículo ${plate} no encontrado en TallerGP`);
      }

      return {
        brand: vehicleData.brand || vehicleData.make,
        model: vehicleData.model,
        vin: vehicleData.vin || vehicleData.chassis,
        engineCode: vehicleData.engineCode || vehicleData.engine_code,
        year: vehicleData.year || new Date().getFullYear()
      };
    } catch (error) {
      console.error(`[TallerGP] Error fetching vehicle data for plate ${plate}:`, error);
      throw error;
    }
  }
}
