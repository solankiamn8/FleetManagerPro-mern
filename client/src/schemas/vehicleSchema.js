import { z } from "zod"

const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export const vehicleSchema = z.object({
  make: z
    .string()
    .min(2, "Make is too short")
    .max(30)
    .transform(capitalize),

  model: z
    .string()
    .min(1, "Model is required")
    .max(30)
    .transform(capitalize),

  licensePlate: z
    .string()
    .regex(
      /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
      "Invalid Indian license plate"
    )
    .transform(v => v.toUpperCase()),

  mileage: z.coerce
    .number()
    .min(0, "Mileage must be ≥ 0"),

  fuelEfficiency: z.coerce
    .number()
    .min(1)
    .max(100),
})
