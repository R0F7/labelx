"use server";

import fs from "fs";

export const updateEnv = async (formData: FormData) => {
  const name = formData.get("name");
  fs.writeFileSync(".env", `\nNAME=${name}`);
};
