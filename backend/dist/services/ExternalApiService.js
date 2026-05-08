"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalApiService = void 0;
const axios_1 = __importDefault(require("axios"));
const MOCK_VEHICLES = {
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
class ExternalApiService {
    static async getVehicleByPlate(plate) {
        const normalizedPlate = plate.toUpperCase().trim();
        if (this.TALLERGP_API_KEY) {
            return this.fetchFromRealAPI(normalizedPlate);
        }
        if (MOCK_VEHICLES[normalizedPlate]) {
            return Promise.resolve(MOCK_VEHICLES[normalizedPlate]);
        }
        return Promise.reject(new Error(`Vehículo ${normalizedPlate} no encontrado en base de datos local`));
    }
    static async fetchFromRealAPI(plate) {
        try {
            const response = await axios_1.default.get(`${this.TALLERGP_API_BASE}/vehicle/${plate}`, {
                headers: {
                    Authorization: `Bearer ${this.TALLERGP_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 5000
            });
            return {
                brand: response.data.brand || response.data.make,
                model: response.data.model,
                vin: response.data.vin || response.data.chassis,
                engineCode: response.data.engineCode || response.data.engine_code,
                year: response.data.year || new Date().getFullYear()
            };
        }
        catch (error) {
            console.error(`Error fetching vehicle data for plate ${plate}:`, error);
            throw error;
        }
    }
}
exports.ExternalApiService = ExternalApiService;
ExternalApiService.TALLERGP_API_BASE = "https://api.tallergp.com/v1";
ExternalApiService.TALLERGP_API_KEY = process.env.TALLERGP_API_KEY || "";
