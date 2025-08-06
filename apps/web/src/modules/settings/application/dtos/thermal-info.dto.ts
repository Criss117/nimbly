import z from "zod";

export const thermalInfoDto = z.object({
	selectedThermalName: z
		.string()
		.min(1)
		.max(100, {
			error: "El nombre de la impresora debe tener entre 1 y 100 caracteres",
		})
		.nullish(),
	url: z.url(),
	isActive: z.boolean(),
	version: z.string(),
	platform: z.string(),
	os: z.string(),
});

export type ThermalInfoDto = z.infer<typeof thermalInfoDto>;
