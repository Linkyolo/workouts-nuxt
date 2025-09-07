import type { Exercise } from "./Esercise";

export type Workout = {
	startTime: string | null;
	endTime: string | null;
	type: string;
	userId: number;
	exercises: Exercise[];
};
