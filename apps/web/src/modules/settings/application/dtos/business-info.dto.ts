import z from "zod";

export const businessInfoDto = z.object({
	name: z
		.string({
			error: "El nombre de la empresa es obligatorio",
		})
		.max(50, {
			error: "El nombre de la empresa no puede superar los 50 caracteres",
		}),
	address: z
		.string({
			error: "La direccion de la empresa es obligatorio",
		})
		.max(100, {
			error: "La direccion de la empresa no puede superar los 100 caracteres",
		}),
	nit: z
		.string({
			error: "El NIT de la empresa es obligatorio",
		})
		.max(20, {
			error: "El NIT de la empresa no puede superar los 10 caracteres",
		}),
});

export type BusinessInfoDto = z.infer<typeof businessInfoDto>;
