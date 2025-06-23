import { auth } from "@/auth";
import { cache } from "react";

export const getServerSession = cache(auth);
