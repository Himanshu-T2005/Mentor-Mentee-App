import API from "./api"

export const addSkill = async (data: any) => {
  const response = await API.post("/skills/", data)
  return response.data
}

export const getSkills = async () => {
  const response = await API.get("/skills/")
  return response.data
}