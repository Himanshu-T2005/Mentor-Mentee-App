import API from "./api"

export const addPracticeHead = async (data: any) => {
  const response = await API.post("/ph/add", data)
  return response.data
}


export const getAllPracticeHeads = async () => {
  const response = await API.get("/ph/")
  return response.data
}