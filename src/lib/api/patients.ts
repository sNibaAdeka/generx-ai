import { patients, type Patient } from "./mockData";

export class MockApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MockApiError";
  }
}

const pause = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

/** Typed, swappable frontend boundary for the future patient API. */
export async function listPatients(): Promise<Patient[]> {
  await pause(420);
  return patients;
}

export async function getPatient(id: string): Promise<Patient> {
  await pause(280);
  const patient = patients.find((record) => record.id === id);
  if (!patient)
    throw new MockApiError("The requested patient record was not found.");
  return patient;
}
